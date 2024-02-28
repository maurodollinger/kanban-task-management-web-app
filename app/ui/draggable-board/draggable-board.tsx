import { useColumns } from '@/app/contexts/ColumnsContext';
import { TaskData } from '@/app/lib/definitions';
import { DndContext, DragEndEvent, DragOverEvent, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '../card';
import { useRouter } from 'next/navigation';



function DroppableColumn({ id, children }: { id: string, children: React.ReactNode }) {
    const {
        setNodeRef,
    } = useDroppable({
        id: id,
        data: {
            accepts: 'item',
        }
    });


    return (
        <div className='column' ref={setNodeRef}>
            {children}
        </div>
    )
}

/*

function SortableColumn({ id, children }: { id: string, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: id,
        data: {
            type: 'column',
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div className='column' ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}*/

function SortableItem({ task }: { task: TaskData }) {
    const router = useRouter();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.task_id,
        data: {
            type: 'item',
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        boxShadow: isDragging ? '0 0 10px rgba(0, 0, 0, 0.3)' : 'none'
    };

    const handleOnClick = () => {
        if (!isDragging && task.task_id !== undefined) {
            router.push(`?modal=view-task&task-id=${task.task_id}`)
        }
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes}  >
            <Card className='task' onClick={handleOnClick} >
                <span className='drag-handle' {...listeners}></span>
                <h2 className='heading-m'>{task.task_title}</h2>
                <p className='body-m'>
                    {`${task.subtasks_completed} of ${task.subtasks_count} subtasks`}
                </p>
            </Card>
        </div>
    );
}


export function TableBodyDraggable() {
    const { columns, updateColumn, saveColumn, saveTask } = useColumns();

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const sourceColumn = columns.find((col) => col.tasks?.some((task) => task.task_id === active.id));
            const destinationColumn = columns.find((col) => col.tasks?.some((task) => task.task_id === over.id));

            // DRAG OVER DIFFERENT EMPTY COLUMN
            if (sourceColumn && sourceColumn.tasks && destinationColumn === undefined) {
                const destinationColumnWithoutTasks = columns.find((col) => col.id === over.id);
                const activeTask = sourceColumn.tasks.find((task) => task.task_id === active.id);

                if (activeTask && destinationColumnWithoutTasks && (destinationColumnWithoutTasks.tasks === null || destinationColumnWithoutTasks.tasks.length === 0)) {
                    const updatedDestinationsTasks = [activeTask];
                    destinationColumnWithoutTasks.tasks = updatedDestinationsTasks;
                    updateColumn(destinationColumnWithoutTasks)

                    // remove from source
                    const activeTaskIndex = sourceColumn.tasks.findIndex((task) => task.task_id === active.id);
                    if (activeTask && activeTaskIndex !== -1) {
                        const updatedSourceTasks = [...sourceColumn.tasks];
                        updatedSourceTasks.splice(activeTaskIndex, 1);
                        sourceColumn.tasks = updatedSourceTasks;
                        updateColumn(sourceColumn)
                    }
                    return
                }
            }
            if (sourceColumn && destinationColumn && sourceColumn?.id !== destinationColumn?.id) {
                // DRAG OVER DIFFERENT NOT EMPTY COLUMN
                if (sourceColumn.tasks && destinationColumn !== undefined && destinationColumn.tasks) {
                    const activeTask = sourceColumn.tasks.find((task) => task.task_id === active.id);
                    const activeTaskIndex = sourceColumn.tasks.findIndex((task) => task.task_id === active.id);
                    const overTaskIndex = destinationColumn.tasks.findIndex((task) => task.task_id === over.id);

                    if (activeTask) {
                        const updatedDestinationsTasks = [...destinationColumn.tasks];
                        updatedDestinationsTasks.splice(overTaskIndex, 0, activeTask);
                        destinationColumn.tasks = updatedDestinationsTasks;
                        updateColumn(destinationColumn);

                        const updatedSourceTasks = [...sourceColumn.tasks];
                        updatedSourceTasks.splice(activeTaskIndex, 1);
                        sourceColumn.tasks = updatedSourceTasks;
                        updateColumn(sourceColumn);
                    }
                }
            }

        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        // Handling item Sorting
        if (active && over && active.id !== over.id) {
            //find the columns id
            const sourceColumn = columns.find((col) => col.tasks?.some((task) => task.task_id === active.id));
            const destinationColumn = columns.find((col) => col.tasks?.some((task) => task.task_id === over.id));

            // IF DRAG END ON SAME COLUMN OR DIFFERENT COLUMN WITH TASKS
            if (sourceColumn && destinationColumn && sourceColumn?.id === destinationColumn?.id) {
                //  console.log(sourceColumn, destinationColumn);

                if (sourceColumn.tasks && destinationColumn.tasks) {
                    // find indexes
                    const activeTaskIndex = sourceColumn.tasks.findIndex((task) => task.task_id === active.id);
                    const overTaskIndex = sourceColumn.tasks.findIndex((task) => task.task_id === over.id);

                    if (activeTaskIndex !== -1 && overTaskIndex !== -1) {
                        const updatedSourceTasks = [...sourceColumn.tasks];
                        const [movedTask] = updatedSourceTasks.splice(activeTaskIndex, 1);
                        updatedSourceTasks.splice(overTaskIndex, 0, movedTask);
                        sourceColumn.tasks = updatedSourceTasks;
                        updateColumn(sourceColumn)
                        saveColumn(sourceColumn, false);
                    }

                    const activeTask = destinationColumn.tasks.find((task) => task.task_id === active.id);

                    if (activeTask && activeTask?.column_name !== destinationColumn.name) {
                        const copyTask = activeTask;
                        saveTask(copyTask, destinationColumn).then((returnID) => {
                            if (returnID) activeTask.task_id = returnID;
                        })
                    }
                }
            }

        }
        // IF DRAG END ON DIFFERENT EMPTY COLUMN OR COLUMN WITH TASKS OVER ANOTHER TASK
        else if (active && over && active.id === over.id) {
            const destinationColumn = columns.find((col) => col.tasks?.some((task) => task.task_id === over.id));
            // console.log(destinationColumn);
            if (destinationColumn && destinationColumn.tasks/* && destinationColumn.tasks.length === 1*/) {

                const activeTask = destinationColumn.tasks.find((task) => task.task_id === active.id);

                if (activeTask) {
                    const copyTask = activeTask;
                    saveTask(copyTask, destinationColumn).then((returnID) => {
                        if (returnID) activeTask.task_id = returnID;
                    })
                }
            }
        }
    }

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    return (
        <DndContext
            collisionDetection={closestCorners}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            {

                columns.map((col, index) => (
                    (col.tasks && col.tasks.length > 0) ? (
                        <SortableContext key={index} items={col.tasks.map(i => i.task_id)}>
                            <DroppableColumn key={col.id} id={col.id}>
                                {col.tasks.map((task: TaskData) => (
                                    <SortableItem key={task.task_id} task={task} />
                                ))}
                            </DroppableColumn>
                        </SortableContext>
                    ) : (
                        <SortableContext key={index} items={[]}>
                            <DroppableColumn key={col.id} id={col.id}>
                                <div className='task'></div>
                            </DroppableColumn>
                        </SortableContext>
                    )
                ))
            }
        </DndContext>
    )
}

