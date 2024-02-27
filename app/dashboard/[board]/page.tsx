'use client';

import Button from '@/app/ui/custom-button/button';
import Link from 'next/link';
import { TailSpin } from 'svg-loaders-react'
import { TableBodyDraggable } from '@/app/ui/draggable-board/draggable-board';
import { ColumnsProvider, useColumns } from '@/app/contexts/ColumnsContext';


function DashboardPage() {
  const { columns, isLoading } = useColumns();
  return (
    <>
      {
        isLoading ?
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
                    <TableBodyDraggable />
                  }
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


export default function Page({ params }: { params: { board: string } }) {
  return (
    <ColumnsProvider boardSlug={params.board}>
      <DashboardPage />
    </ColumnsProvider>
  )
}

