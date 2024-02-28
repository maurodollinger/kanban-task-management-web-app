'use client'

import Button from "../../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { Field, Form, ErrorMessage, FieldArray, useFormikContext } from 'formik';
import { MyInput } from "../../myInput";
import { getRandomColumnName, getRandomUUID } from "@/app/lib/utils";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { DndContext, DragEndEvent, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from "@dnd-kit/core";


interface SortableInputProps {
    input: { id: string, name: string, placeholder: string };
    index: number;
    remove: (index: number) => void;
}

export function DroppableContainer({ children }: { children: React.ReactNode }) {
    const {
        setNodeRef,
    } = useDroppable({
        id: 'droppable',
        data: {
            accepts: 'item',
        }
    });

    return (
        <div ref={setNodeRef} className="inputs-new-container">
            {children}
        </div>
    )
}

export function SortableInput({ input, index, remove }: SortableInputProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: input.id,
        data: {
            type: 'item',
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} className="input-new" style={style}  {...attributes} >
            <span className='drag-handle' {...listeners}></span>
            <Field name={`columnNames[${index}].name`}
                placeholder={`e.g. ${input.placeholder}`}
                component={MyInput} />
            <button type="button" onClick={() => remove(index)}>
                <CrossIcon />
            </button>
            <ErrorMessage component="span" name={`columnNames[${index}].name`} />
        </div>
    )
}


export const generateNewColumn = () => {
    return { id: getRandomUUID(), name: '', placeholder: getRandomColumnName().placeholder };
}

interface FieldArrayProps {
    columnNames: { id: string, name: string, position: number, placeholder: string }[]
}

export function FieldArrayContainer({ type }: { type: string }) {

    const { values, isSubmitting } = useFormikContext<FieldArrayProps>();

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const { columnNames } = values;

            const dragged = columnNames.find((column) => column.id === active.id);
            const drop = columnNames.find((column) => column.id === over.id);
            const draggedIndex = columnNames.findIndex((column) => column.id === active.id);
            const dropIndex = columnNames.findIndex((column) => column.id === over.id);

            if (dragged && drop) {
                const copyPos = dragged.position;
                dragged.position = drop.position;
                drop.position = copyPos;
            }
            return [draggedIndex, dropIndex];
        }
    }



    return (
        <FieldArray name="columnNames" >
            {({ push, remove, move }) => (
                <>
                    <Form>
                        <div className="inputs-container">
                            <div className="input-group">
                                <label className="body-m">Board Name</label>
                                <Field name="boardName" placeholder="e.g. Web Design" component={MyInput} />
                                <ErrorMessage component="span" name="boardName" />
                            </div>
                            <div className="input-group">
                                {values.columnNames.length > 0 && <label className="body-m">Board Columns</label>}

                                <DndContext
                                    collisionDetection={closestCorners}
                                    sensors={sensors}
                                    onDragEnd={(e) => {
                                        const items = handleDragEnd(e);
                                        if (items) move(items[0], items[1]);
                                    }}>
                                    <SortableContext items={values.columnNames.map((i) => i.id)}>
                                        <DroppableContainer>
                                            {values.columnNames.map((input, index) => (
                                                <SortableInput key={input.id} input={input} index={index} remove={remove} />
                                            ))}
                                        </DroppableContainer>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </div>
                        <div className="buttons-container">
                            <Button buttonType="secondary" onClick={() => push(generateNewColumn())}>+ Add New Column</Button>
                            <Button buttonType="primary-s" type="submit" disabled={isSubmitting}>
                                {type === 'create' ? 'Create New Board' : 'Save Changes'}
                            </Button>
                        </div>
                    </Form>
                </>

            )}
        </FieldArray>
    )
}