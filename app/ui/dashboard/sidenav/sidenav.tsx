'use client';

import React, { useEffect, useState } from 'react';
import styles from './sidenav.module.scss';
import BoardLinks from './board-links';
import SidenavActions from './sidenav-actions';
import ShowIcon from '@/public/assets/icon-show-sidebar.svg';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useMediaQuery } from '@react-hook/media-query';
import { useBoardContext } from '@/app/contexts/BoardContext';

export default function Sidenav() {

    const { boards } = useBoardContext();
    const isMobile = useMediaQuery('only screen and (max-width: 600px)')
    const [hideOnMobile, setHideOnMobile] = useState(false);

    useEffect(() => {
        setHideOnMobile(isMobile);
    }, [isMobile]);

    const { darkMode, sidebarHidden, toggleSidebarVisibility } = useTheme();

    return (
        <section className={`${(darkMode) ? styles.darkMode : ''} ${styles.sidebarContainer}`}>
            {!hideOnMobile ?
                <>
                    <div className={`${styles.hiddenBorderLogo} ${sidebarHidden ? styles.hidden : ''}`}></div>
                    <div className={`${styles.sidenav} ${sidebarHidden ? styles.hidden : ''}`}>
                        <div>
                        </div>
                        <BoardLinks boards={boards} />
                        <SidenavActions handleHideSidebar={toggleSidebarVisibility} />
                    </div>
                    <div onClick={toggleSidebarVisibility} className={`${styles.showSidenav} ${!sidebarHidden ? styles.hidden : ''}`}>
                        <ShowIcon />
                    </div>
                </>
                :
                <>
                </>
            }

        </section>
    )
}