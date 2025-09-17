// Fix: Implement the main App component to manage state and tie all pieces together.
import React, { useState, useEffect, useCallback } from 'react';
import SudokuGrid from './components/SudokuGrid';
import Controls from './components/Controls';
import NumberPalette from './components/NumberPalette';
import { generateSudoku } from './services/sudokuService';
import { SudokuGrid as GridType, SudokuGridData, InputMode, SudokuValue, CellValue } from './types';

const GRID_SIZE = 9;

const createEmptyGridData = (): SudokuGridData =>
    Array(GRID_SIZE).fill(null).map(() =>
        Array(GRID_SIZE).fill(null).map(() => ({
            value: null,
            isGiven: false,
            notes: new Set<SudokuValue>(),
        }))
    );

const App: React.FC = () => {
    const [gridData, setGridData] = useState<SudokuGridData>(createEmptyGridData());
    const [solution, setSolution] = useState<GridType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [difficulty, setDifficulty] = useState(40); // Medium
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [inputMode, setInputMode] = useState<InputMode>('normal');
    const [conflicts, setConflicts] = useState<Set<string>>(new Set());
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const checkConflicts = useCallback((currentGrid: SudokuGridData): Set<string> => {
        const newConflicts = new Set<string>();
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const cell = currentGrid[i][j];
                if (cell.value === null) continue;

                // Check row
                for (let k = 0; k < GRID_SIZE; k++) {
                    if (k !== j && currentGrid[i][k].value === cell.value) {
                        newConflicts.add(`${i}-${j}`);
                        newConflicts.add(`${i}-${k}`);
                    }
                }

                // Check column
                for (let k = 0; k < GRID_SIZE; k++) {
                    if (k !== i && currentGrid[k][j].value === cell.value) {
                        newConflicts.add(`${i}-${j}`);
                        newConflicts.add(`${k}-${j}`);
                    }
                }

                // Check 3x3 box
                const startRow = Math.floor(i / 3) * 3;
                const startCol = Math.floor(j / 3) * 3;
                for (let row = startRow; row < startRow + 3; row++) {
                    for (let col = startCol; col < startCol + 3; col++) {
                        if ((row !== i || col !== j) && currentGrid[row][col].value === cell.value) {
                            newConflicts.add(`${i}-${j}`);
                            newConflicts.add(`${row}-${col}`);
                        }
                    }
                }
            }
        }
        return newConflicts;
    }, []);

    useEffect(() => {
        setConflicts(checkConflicts(gridData));
    }, [gridData, checkConflicts]);

    const handleGenerate = useCallback(() => {
        setIsLoading(true);
        setSelectedCell(null);
        setTimeout(() => {
            const { puzzle, solution: newSolution } = generateSudoku(difficulty);
            const newGridData: SudokuGridData = puzzle.map(row =>
                row.map(cellValue => ({
                    value: cellValue,
                    isGiven: cellValue !== null,
                    notes: new Set(),
                }))
            );
            setGridData(newGridData);
            setSolution(newSolution);
            setIsLoading(false);
        }, 50);
    }, [difficulty]);

    useEffect(() => {
        handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClear = () => {
        setGridData(currentGrid =>
            currentGrid.map(row =>
                row.map(cell =>
                    cell.isGiven ? cell : { ...cell, value: null, notes: new Set() }
                )
            )
        );
        setSelectedCell(null);
    };

    const handleSolve = () => {
        if (!solution) return;
        const solvedGridData = gridData.map((row, r) =>
            row.map((cell, c) => ({
                ...cell,
                value: solution[r][c],
                notes: new Set(),
            }))
        );
        setGridData(solvedGridData);
    };

    const handleCellSelect = (row: number, col: number) => {
        setSelectedCell({ row, col });
    };

    const handleNumberInput = useCallback((num: number | null) => {
        setSelectedNumber(num);
        if (!selectedCell) return;
        const { row, col } = selectedCell;

        setGridData(currentGrid => {
            const newGrid = currentGrid.map(r => r.map(c => ({ ...c, notes: new Set(c.notes) })));
            const cell = newGrid[row][col];
            if (cell.isGiven) return currentGrid;

            if (inputMode === 'normal') {
                cell.value = num as CellValue;
                cell.notes.clear();
            } else { // notes mode
                if (cell.value === null) {
                    if (num === null) {
                        cell.notes.clear();
                    } else if (cell.notes.has(num as SudokuValue)) {
                        cell.notes.delete(num as SudokuValue);
                    } else {
                        cell.notes.add(num as SudokuValue);
                    }
                }
            }
            return newGrid;
        });
    }, [selectedCell, inputMode]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey) return;

        if (selectedCell) {
            if (e.key >= '1' && e.key <= '9') {
                handleNumberInput(parseInt(e.key, 10));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                handleNumberInput(null);
            } else if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                setSelectedCell(prev => {
                    if (!prev) return prev;
                    let { row, col } = prev;
                    if (e.key === 'ArrowUp') row = Math.max(0, row - 1);
                    if (e.key === 'ArrowDown') row = Math.min(8, row + 1);
                    if (e.key === 'ArrowLeft') col = Math.max(0, col - 1);
                    if (e.key === 'ArrowRight') col = Math.min(8, col + 1);
                    return { row, col };
                });
            }
        }
        if (e.key.toLowerCase() === 'i') {
            setInputMode(prev => prev === 'normal' ? 'notes' : 'normal');
        }
    }, [selectedCell, handleNumberInput]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-400 tracking-wider">Sudoku AI</h1>
            <SudokuGrid grid={gridData} selectedCell={selectedCell} onCellSelect={handleCellSelect} conflicts={conflicts} />
            <NumberPalette onNumberSelect={handleNumberInput} selectedNumber={selectedNumber} />
            <Controls
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                onGenerate={handleGenerate}
                onClear={handleClear}
                onSolve={handleSolve}
                isLoading={isLoading}
                inputMode={inputMode}
                onInputModeChange={setInputMode}
            />
        </div>
    );
};

export default App;
