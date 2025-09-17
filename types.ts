// Fix: Provide concrete type definitions for the Sudoku application.
export type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = SudokuValue | null;
export type SudokuGrid = CellValue[][];

export type InputMode = 'normal' | 'notes';

export interface CellData {
    value: CellValue;
    isGiven: boolean;
    notes: Set<SudokuValue>;
}

export type SudokuGridData = CellData[][];
