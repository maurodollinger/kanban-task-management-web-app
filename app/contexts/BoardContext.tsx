'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Board, Column, ColumnNamesByBoard } from '../lib/definitions';
import { useParams } from 'next/navigation';
import { getBoards } from '../lib/actions';
import { getRandomColumnName } from '../lib/utils';


interface BoardContextProp {
    boards: Board[],
    currentBoard: Board | null,
    currentColumns: Column[],
    updateUserId: (id: string) => void,
    updateBoards: () => void,
    updateCurrentBoard: (updatedBoard: Board) => void
}

interface BoardProviderProps {
    children: React.ReactNode,
}

const BoardContext = createContext<BoardContextProp | undefined>(undefined);

export const BoardProvider = ({ children }: BoardProviderProps) => {
    const { board: boardSlug } = useParams();
    const [userId, setUserID] = useState('');
    const [boards, setBoards] = useState<Board[]>([]);
    const [columnNames, setColumnNames] = useState<ColumnNamesByBoard[]>([]);
    const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
    const [currentColumns, setCurrentColumns] = useState<Column[]>([])

    const updateBoards = () => {
        if (userId) {
            getBoards(userId).then((result) => {
                setBoards(result.boards);
                setColumnNames(result.columns);

                console.log(result.columns);
            });
        }
    };

    const updateCurrentBoard = (updatedBoard: Board) => {
        setCurrentBoard(updatedBoard);
    }

    const updateUserId = (id: string) => {
        setUserID(id);
    }

    useEffect(() => {
        updateBoards();
    }, [userId])

    useEffect(() => {
        if (boards !== undefined) {
            const board = boards.filter((c) => c.slug === boardSlug);
            setCurrentBoard(board[0])
        }
    }, [boardSlug, boards])

    useEffect(() => {
        if (currentBoard) {
            const names = columnNames.filter((c) => c.board_slug === currentBoard.slug).map((c) => c.board_columns).flat();
            const columns = [];
            for (let i = 0; i < names.length; i++) {
                columns.push({ name: names[i].name, position: names[i].position, id: names[i].id, placeholder: getRandomColumnName().placeholder })
            }
            setCurrentColumns(columns);
        }
    }, [currentBoard]);

    return (
        <BoardContext.Provider value={{ boards, currentBoard, currentColumns, updateUserId, updateBoards, updateCurrentBoard }}>
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
