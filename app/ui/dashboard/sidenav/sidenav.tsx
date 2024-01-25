'use client';

import React from 'react';
import styles from './sidenav.module.scss';
import BoardLinks from './board-links';
import SidenavActions from './sidenav-actions';
import ShowIcon from '@/public/assets/icon-show-sidebar.svg';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Board } from '@/app/lib/definitions';

export default function Sidenav({boards} : {boards : Board[]}){
    const {darkMode, sidebarHidden, toggleSidebarVisibility} =useTheme();

    return(
        <section className={`${(darkMode) ? styles.darkMode : ''} ${styles.sidebarContainer}`}>
            <div className={`${styles.hiddenBorderLogo} ${sidebarHidden ? styles.hidden : ''}`}></div>
            <div className={`${styles.sidenav} ${sidebarHidden ? styles.hidden : ''}`}>
                <div>
                </div>            
                <BoardLinks boards={boards}/>
                <SidenavActions handleHideSidebar={toggleSidebarVisibility}/>
            </div>
            <div onClick={toggleSidebarVisibility} className={`${styles.showSidenav} ${!sidebarHidden ? styles.hidden : ''}`}>
                <ShowIcon/>
            </div>
        </section>
    )
}