'use client';

import Image from 'next/image';
import styles from './header.module.scss';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@react-hook/media-query';
import Button from '../custom-button/button';
import Link from 'next/link';
import { useBoardContext } from '@/app/contexts/BoardContext';
import Popup from '../popup/popup';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
    const { boards } = useBoardContext();
    const { logout } = useAuth();
    const isMobile = useMediaQuery('only screen and (max-width: 600px)')
    const [hideOnMobile, setHideOnMobile] = useState(false);
    const { darkMode, sidebarHidden } = useTheme()
    const { board: boardSlug } = useParams();
    const [boardName, setBoardName] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);

    const handlePopUpVisible = () => {
        setPopupVisible(prevState => !prevState);
    }

    useEffect(() => {
        setHideOnMobile(isMobile);
    }, [isMobile]);

    useEffect(() => {
        const currentBoard = boards.find((board: { slug: string | string[]; }) => {
            if (board.slug === boardSlug) return board;
        });
        if (currentBoard) setBoardName(currentBoard.name);
        else setBoardName('');
    }, [boards, boardSlug])


    return (
        <header className={`${styles.header} ${darkMode ? styles.darkMode : ''} ${sidebarHidden ? styles.sidebarHidden : ''}`}>
            <div>
                {
                    hideOnMobile ?
                        <Image
                            src='/assets/logo-mobile.svg'
                            alt='Kanban logo'
                            width={24}
                            height={25}
                            priority={true} />
                        : (
                            darkMode ? (
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
                            )
                        )
                }
            </div>
            {hideOnMobile
                ? (
                    <Link href='?modal=menu'><h1 className='heading-l'>
                        {boardName}
                        <Image
                            src='/assets/icon-chevron-down.svg'
                            alt='icon down'
                            width={10}
                            height={7}
                            priority={true} />
                    </h1>
                    </Link>
                )
                : <h1 className='heading-xl'>{boardName}</h1>
            }


            <div className={styles.actions}>
                {boardSlug && (
                    <Link href='?modal=create-task'>
                        <Button buttonType='primary'>
                            +{!hideOnMobile && (' Add New Task')}
                        </Button>
                    </Link>
                )}
                <button onClick={handlePopUpVisible}>
                    <Image
                        src='/assets/icon-vertical-ellipsis.svg'
                        alt='icon edit'
                        width={5}
                        height={20}>

                    </Image>
                </button>
                <Popup visible={popupVisible}>
                    {boardSlug && (
                        <>
                            <Link href='?modal=edit-board' onClick={handlePopUpVisible}><Button buttonType='primary-s'>Edit Board</Button></Link>
                            <Link href='?modal=delete&type=board' onClick={handlePopUpVisible}><Button buttonType='destructive' >Delete Board</Button></Link>
                        </>
                    )}
                    <Button buttonType='destructive' onClick={logout}>Logout</Button>
                </Popup>
            </div>

        </header>
    )
}
