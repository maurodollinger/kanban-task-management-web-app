'use client';

import React, { useState } from 'react';
import styles from './sidenav.module.scss';
import BoardLinks from './board-links';
import SidenavActions from './sidenav-actions';
import ShowIcon from '@/public/assets/icon-show-sidebar.svg';
import { useTheme } from '@/app/contexts/ThemeContext';


export default function Sidenav(){
    const {darkMode} =useTheme();
  //  console.log(darkMode);
    const [isHidden,setIsHidden] = useState(false);

    const handleHideSidebar = () =>{
        setIsHidden(prev=>!prev);
    }

    return(
        <div className={(darkMode) ? styles.darkMode : ''}>
            <div className={`${styles.hiddenBorderLogo} ${isHidden ? styles.hidden : ''}`}></div>
            <div className={`${styles.sidenav} ${isHidden ? styles.hidden : ''}`}>
                <div>
                </div>            
                <BoardLinks/>
                <SidenavActions handleHideSidebar={handleHideSidebar}/>
            </div>
            <div onClick={handleHideSidebar} className={`${styles.showSidenav} ${!isHidden ? styles.hidden : ''}`}>
                <ShowIcon/>
            </div>
        </div>
    )
}