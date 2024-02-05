'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Board, Column, ColumnNamesByBoard } from '../lib/definitions';
import { useParams } from 'next/navigation';


interface BoardContextProp {
    boards: Board[],
    currentBoard: Board,
    currentColumns: Column[],
    updateBoards: (boards: []) => void,
    updateCurrentBoard: (updatedBoard: Board) => void
}

interface BoardProviderProps {
    children: React.ReactNode,
    initialBoards: Board[],
    columnNames: ColumnNamesByBoard[]
}

const BoardContext = createContext<BoardContextProp | undefined>(undefined);

export const BoardProvider = ({ children, initialBoards, columnNames }: BoardProviderProps) => {
    const { board: boardSlug } = useParams();
    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [currentBoard, setCurrentBoard] = useState<Board>(initialBoards[0]);
    const [currentColumns, setCurrentColumns] = useState<Column[]>([])

    const updateBoards = (newBoards: []) => {
        setBoards(newBoards);
    };

    const updateCurrentBoard = (updatedBoard: Board) => {
        setCurrentBoard(updatedBoard);
    }

    useEffect(() => {
        const board = boards.filter((c) => c.slug === boardSlug);
        setCurrentBoard(board[0])
    }, [boardSlug])

    useEffect(() => {
        if (currentBoard) {
            const names = columnNames.filter((c) => c.board_slug === currentBoard.slug).map((c) => c.column_names).flat();
            const columns = [];
            for (let i = 0; i < names.length; i++) {
                columns.push({ name: names[i] })
            }
            setCurrentColumns(columns);
        }
    }, [currentBoard]);

    return (
        <BoardContext.Provider value={{ boards, currentBoard, currentColumns, updateBoards, updateCurrentBoard }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoardContext = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoardContext must be used within a BoardProvider');
    }
    return context;
};
