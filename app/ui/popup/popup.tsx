import { useEffect, useRef, useState } from "react";

export default function Popup({ visible, children }: { visible: boolean, children: React.ReactNode }) {
    const [popupVisible, setPopupVisible] = useState(visible);
    const popUpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPopupVisible(prev => !prev);
    }, [visible])

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (popUpRef.current && !popUpRef.current.contains(event.target as Node)) {
                setPopupVisible(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [popupVisible]);

    return (
        popupVisible && <div ref={popUpRef} className={'popup card'}>
            {children}
        </div>
    )
}