import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, usePathname, useRouter } from "next/navigation";
import { createContext, useContext } from "react"

interface ModalContextProps {
    pathname: string;
    router: AppRouterInstance
    taskId: string | undefined;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children, searchParams }: { children: React.ReactNode, searchParams: ReadonlyURLSearchParams }) => {

    const taskId = searchParams.get('task-id') || undefined;
    const pathname = usePathname()
    const router = useRouter();

    return (
        <ModalContext.Provider value={{ pathname, router, taskId }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used with ModalProvider');
    }
    return context;
}