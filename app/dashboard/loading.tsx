import './page.scss';
import { TailSpin } from 'svg-loaders-react'

export default function Loading() {
    return (
        <div className='dashboard-loading'>
            <TailSpin />
        </div>
    )
}