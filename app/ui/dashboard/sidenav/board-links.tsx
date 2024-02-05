'use client';

import BoardIcon from '@/public/assets/icon-board.svg';
import styles from './sidenav.module.scss';
import { jakarta } from '@/app/ui/fonts';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Board } from '@/app/lib/definitions';
import { useBoardContext } from '@/app/contexts/BoardContext';

export default function BoardLinks({ boards }: { boards: Board[] }) {
    const { updateCurrentBoard } = useBoardContext();
    const pathname = usePathname();
    const { board: boardSlug } = useParams();

    const handleBoardChange = (updatedBoard: Board) => {
        updateCurrentBoard(updatedBoard);
    }
    return (
        <div>
            <p className='heading-s'>ALL BOARDS ({boards.length})</p>
            <ul>
                {boards.map((board, index) => (

                    <li className={`${(boardSlug === board.slug) ? styles.active : ''} heading-m`}
                        key={index}>

                        <BoardIcon />
                        {pathname === '/dashboard' ?
                            <Link href={`/dashboard/${board.slug}`} onClick={() => handleBoardChange(board)}>
                                {board.name}
                            </Link>
                            :
                            <Link href={board.slug} onClick={() => handleBoardChange(board)}>
                                {board.name}
                            </Link>
                        }
                    </li>

                ))}
            </ul>
            <Link href="?modal=create-board">
                <button className={`${jakarta.className} ${styles.createNewBoard}`}>
                    <BoardIcon />
                    + Create New Board
                </button>
            </Link>

        </div>
    )
}