

const boardsNames = [
    {label:"Platform Launch",slug:'platform-launch'},
    {label:"Marketing Plan",slug:'marketing-plan'},
    {label:"Roadmap",slug:'roadmap'}
];

export default async function Page({ params }: { params: { slug: string } }) {
    return(
        <main>
            <h1>Board</h1>
            <p>{params.slug}</p>
        </main>
    )
}


export async function generateStaticParams() {
   
    return boardsNames.map((board) => ({
      slug: board.slug,
    }))
  }