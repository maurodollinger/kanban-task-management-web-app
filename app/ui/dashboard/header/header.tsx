'use client';

import Image from 'next/image';
import styles from './header.module.scss';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useParams } from 'next/navigation';
import { Board } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';


export default function Header({boards} : {boards : Board[]}){
    const {darkMode, sidebarHidden} = useTheme()
    const {board:boardSlug} = useParams();
    const [boardName,setBoardName] = useState('');

    useEffect(()=>{
        const currentBoard = boards.find((board)=>{
            if(board.slug === boardSlug) return board;
        });
        if(currentBoard) setBoardName(currentBoard.name);
    },[boards,boardSlug])

    return(
        <header className={`${styles.header} ${darkMode ? styles.darkMode : ''} ${sidebarHidden ? styles.sidebarHidden : ''}`}>
            <div>
                { darkMode ? (
                    <Image
                    src='/assets/logo-light.svg'
                    alt='Kanban logo'
                    width={153}
                    height={26}
                    priority={true}
                    />
                ) : (
                    <Image
                    src='/assets/logo-dark.svg'
                    alt='Kanban logo'
                    width={153}
                    height={26}
                    priority={true}
                    />     
                )}
                </div>  
                <h1 className='heading-xl'>{boardName}</h1>
        </header>
    )
}
