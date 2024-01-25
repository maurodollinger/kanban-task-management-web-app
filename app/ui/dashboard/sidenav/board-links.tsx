'use client';

import BoardIcon from '@/public/assets/icon-board.svg';
import styles from './sidenav.module.scss';
import { jakarta } from '@/app/ui/fonts';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Board } from '@/app/lib/definitions';

export default function BoardLinks({boards}:{boards:Board[]}){
    const {board:boardSlug} = useParams();

    return(
        <div>
            <p className='heading-s'>ALL BOARDS ({boards.length})</p>
            <ul>
                {boards.map((board, index)=>(
                
                    <li className={`${(boardSlug===board.slug) ? styles.active : ''} heading-m`} 
                        key={index}>

                        <BoardIcon/>
                        <Link href={board.slug}>
                        {board.name} 
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