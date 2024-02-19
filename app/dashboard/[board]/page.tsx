'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { TaskData } from '@/app/lib/definitions';
import Card from '@/app/ui/card';
import Button from '@/app/ui/custom-button/button';
import Link from 'next/link';
import { getColumnsData } from '@/app/lib/actions';
import { TailSpin } from 'svg-loaders-react'
import { useBoardContext } from '@/app/contexts/BoardContext';

type ColumnType = {
  name: string;
  position: number;
  tasks: TaskData[] | null;
}

async function getColumns(userId: string, boardSlug: string) {
  try {
    const columnsData = await getColumnsData(userId, boardSlug);

    const uniqueTypes = Array.from(new Set(columnsData.map(item => item.column_name)));
    const columns: ColumnType[] = [];

    uniqueTypes.forEach(type => {
      const filtered = columnsData.filter((col) => col.column_name === type)

      if (filtered[0].task_title !== null) {
        columns.push({ name: type, position: filtered[0].column_position, tasks: [...filtered] });
      } else {
        columns.push({ name: type, position: filtered[0].column_position, tasks: null });
      }
    });

    columns.sort((a, b) => a.position - b.position);

    return columns;
  }
  catch (error) {
    console.error('Error fetching columns:', error);
    return [];
  }
}

export default function Page({ params }: { params: { board: string } }) {
  const { refresh } = useBoardContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [columns, setColumns] = useState<ColumnType[]>([])

  useEffect(() => {
    if (user.id) {
      getColumns(user.id, params.board).then((results: ColumnType[]) => {
        if (results.length) {
          setColumns([...results]);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user.id, params.board, refresh])


  return (
    <>
      {isLoading ?
        <div className='oval-loading'>
          <TailSpin />
        </div>
        :
        (columns && columns.length > 0) ? (
          <>
            {/* TABLE HEADER*/}
            <div className='grid'>
              <div className='gridRow rowHead'>
                {
                  columns.map((col, index) => (
                    <div key={index} className='column'>
                      <h3 className='heading-s'>
                        <span></span>
                        {col.name}
                        {col.tasks !== null ? ` (${col.tasks.length})` : ' (0)'}
                      </h3>
                    </div>
                  ))
                }
              </div>
              {/* TABLE BODY*/}
              <div className='gridRow'>
                {
                  columns.map((col, index) => (
                    <div key={index} className='column'>
                      {(col.tasks && col.tasks.length > 0) ? (
                        col.tasks.map((task: TaskData) => (
                          <Link key={task.task_id} href={`?modal=view-task&task-id=${task.task_id}`}>
                            <Card className='task'>
                              <h2 className='heading-m'>{task.task_title}</h2>
                              <p className='body-m'>
                                {`${task.subtasks_completed} of ${task.subtasks_count} subtasks`}
                              </p>
                            </Card>
                          </Link>
                        ))
                      ) : (
                        <div className='task'></div>
                      )}
                    </div>
                  ))}
                <div className='column newColumnContainer'>
                  <Link href='?modal=edit-board'>
                    <button className='btnNewColumn heading-xl'>
                      + New Column
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </>
        ) : null}
      {columns && columns.length === 0 && !isLoading &&
        (
          <div className='empty-board'>
            <p className='heading-l'>This board is empty. Create a new column to get started</p>
            <Link href='?modal=edit-board'><Button buttonType='primary'>+ Add New Column</Button></Link>
          </div>
        )
      }
    </>
  )
}

