'use client';

import Image from 'next/image';
import styles from './header.module.scss';
import { useTheme } from '@/app/contexts/ThemeContext';


const Header:React.FC = () =>{
    const {darkMode} = useTheme()
    return(
        <header className={`${styles.header} ${darkMode ? styles.darkMode : ''}`}>
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
        </header>
    )
}

export default Header;