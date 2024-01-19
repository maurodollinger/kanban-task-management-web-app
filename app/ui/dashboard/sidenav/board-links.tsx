'use client';

import BoardIcon from '@/public/assets/icon-board.svg';
import styles from './sidenav.module.scss';
import { jakarta } from '@/app/ui/fonts';

import { placeholderData } from '@/app/lib/placeholder-data';
import { Board } from '@/app/lib/definitions';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const boardsNames = [
    {label:"Platform Launch",slug:'platform-launch'},
    {label:"Marketing Plan",slug:'marketing-plan'},
    {label:"Roadmap",slug:'roadmap'}
];

export default function BoardLinks(){
    const {board:boardSlug} = useParams();
    const boards:Board[] = placeholderData.boards;

    return(
        <div>
            <p className='heading-s'>ALL BOARDS ({boards.length})</p>
            <ul>
                {boardsNames.map((board, index)=>(
                
                    <li className={`${(boardSlug===board.slug) ? styles.active : ''} heading-m`} 
                        key={index}>

                        <BoardIcon/>
                        <Link href={board.slug}>
                        {board.label} 
                        </Link>                       
                    </li>
                    
                ))}
            </ul>
            <button className={`${jakarta.className} ${styles.createNewBoard}`}>
            <BoardIcon/>
            + Create New Board
            </button>
        </div>
    )
}