'use client';

import { useRouter } from 'next/navigation';
import { placeholderData } from '../lib/placeholder-data';
import styles from './page.module.scss';
import { useEffect } from 'react';

export default function Page(){
    const router = useRouter();

    useEffect(()=>{
        if (placeholderData.boards.length > 0) {
            const firstBoardName = placeholderData.boards[0].slug;
            router.push(`/dashboard/${firstBoardName}`);
        }
    },[])

    return(
        <>
            <main className={styles.main}>
             <div>Loading...</div>
            </main>
        </>
    )
}