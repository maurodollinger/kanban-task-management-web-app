
type Props = {
    children: React.ReactNode;
    buttonType: string;
    onClick?: () => void
}

export default function Button({ children, buttonType, onClick }: Props) {
    return (
        <button className={`custom-button ${buttonType}`} onClick={onClick}>
            {(buttonType === 'primary-s' || buttonType === 'secondary' || buttonType === 'destructive') && (
                <p>
                    {children}
                </p>
            )}
            {buttonType === 'primary' && (
                <p className="heading-m">
                    {children}
                </p>
            )}
        </button>
    )
}