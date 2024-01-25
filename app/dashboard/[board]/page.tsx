import { fetchColumns } from '@/app/lib/data';
import { TaskData } from '@/app/lib/definitions';
import Card from '@/app/ui/card';

export default async function Page({ params }: { params: { board: string} }) {
    const columnsData = await fetchColumns(params.board);

    const uniqueTypes = Array.from(new Set(columnsData.map(item => item.column_name)));

    const columns = new Array;
    uniqueTypes.forEach(type => {
        const filtered = columnsData.filter((col)=>col.column_name===type)
        columns.push({name:type,tasks:[...filtered]});
    });

    //console.log(columns);

    return(
        <>
        {
          (columns && columns.length > 0) && (
            <>           
              {/* TABLE HEADER*/}
              <div className='grid'>
                <div className='gridRow rowHead'>
                  {
                    columns.map((col,index) => (
                      <div key={index} className='column'>
                        <h3 className='heading-s'>
                          <span></span>
                          {`${col.name} (${col.tasks.length})`}
                        </h3>
                      </div>              
                    ))             
                  }
                </div>              
                {/* TABLE BODY*/}
                <div className='gridRow'>
                  {
                  columns.map((col,index)=>(
                    <div key={index} className='column'>
                      {(col.tasks && col.tasks.length > 0) && (
                        col.tasks.map((task:TaskData)=>(
                          <Card key={task.task_id} className='task'>
                            <h2 className='heading-m'>{task.task_title}</h2>
                            <p className='body-m'>
                              {`${task.subtasks_completed} of ${task.subtasks_count} subtasks`}
                            </p>
                          </Card>
                        ))
                        
                      )}
                    </div>  
                  )) }
                </div>
              </div>
            </>
          )
        }
        </>
    )
}
/*


export async function generateStaticParams() {

    const boardsNames = [
      { slug: 'platform-launch' },
      { slug: 'marketing-plan' },
      { slug: 'roadmap' },
    ];
  
    return boardsNames.map((board) => ({
      params: { board: board.slug },
    }));
  }*/