import { ThreeDots } from 'svg-loaders-react'

type Props = {
    children: React.ReactNode;
    buttonType: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: () => void
}

export default function Button({ children, buttonType, type = 'button', disabled = false, onClick }: Props) {
    return (
        <button className={`custom-button ${buttonType}`} onClick={onClick} type={type} disabled={disabled}>
            {(buttonType === 'primary-s' || buttonType === 'secondary' || buttonType === 'destructive') && (
                <p>
                    {disabled ? <ThreeDots /> : children}
                </p>
            )}
            {buttonType === 'primary' && (
                <p className="heading-m">
                    {disabled ? <ThreeDots /> : children}
                </p>
            )}
        </button>
    )
}