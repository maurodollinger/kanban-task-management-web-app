import React, { MouseEventHandler } from "react";

type CardProps = {
    children: React.ReactNode;
    className?: string;
    onClick?: MouseEventHandler
}

export default function Card({ children, className, onClick }: CardProps) {
    return (
        <div className={`card ${className}`} onClick={onClick}>
            {children}
        </div>
    )
}