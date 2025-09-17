// Fix: Implement the SudokuGrid component to render the game board.
import React from 'react';
import { SudokuGridData, SudokuValue } from '../types';

interface SudokuGridProps {
  grid: SudokuGridData;
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  conflicts: Set<string>;
}

const Cell: React.FC<{
  cellData: SudokuGridData[0][0];
  isSelected: boolean;
  isPeer: boolean;
  isSameValue: boolean;
  isConflict: boolean;
  onClick: () => void;
}> = ({ cellData, isSelected, isPeer, isSameValue, isConflict, onClick }) => {
  const { value, isGiven, notes } = cellData;

  const cellClasses = [
    'w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold cursor-pointer transition-colors duration-200 aspect-square',
    isGiven ? 'text-cyan-400' : 'text-slate-100',
    isSelected ? 'bg-cyan-800/50' : isPeer ? 'bg-slate-700/50' : 'bg-slate-800/30',
    isSameValue && !isSelected && value !== null ? 'bg-cyan-600/40' : '',
    isConflict && !isGiven ? 'text-red-500' : '',
    'hover:bg-slate-700'
  ].join(' ');

  return (
    <div onClick={onClick} className={cellClasses}>
      {value ? (
        <span>{value}</span>
      ) : (
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full text-xs text-slate-400 p-px">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {notes.has((i + 1) as SudokuValue) ? i + 1 : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SudokuGrid: React.FC<SudokuGridProps> = ({ grid, selectedCell, onCellSelect, conflicts }) => {
  const handleCellClick = (row: number, col: number) => {
    onCellSelect(row, col);
  };

  const isPeer = (r1: number, c1: number, r2: number, c2: number): boolean => {
    if (r1 === r2 && c1 === c2) return false;
    if (r1 === r2 || c1 === c2) return true;
    if (Math.floor(r1 / 3) === Math.floor(r2 / 3) && Math.floor(c1 / 3) === Math.floor(c2 / 3)) return true;
    return false;
  };

  const selectedValue = selectedCell ? grid[selectedCell.row][selectedCell.col].value : null;

  return (
    <div className="w-full max-w-lg mx-auto aspect-square p-2 bg-slate-800/50 rounded-lg shadow-lg">
        <div className="grid grid-cols-9 grid-rows-9 gap-px bg-slate-600 border-2 border-slate-600">
        {grid.map((row, r) =>
            row.map((cellData, c) => {
            const isSelected = selectedCell?.row === r && selectedCell?.col === c;
            const isCellPeer = selectedCell ? isPeer(r, c, selectedCell.row, selectedCell.col) : false;
            const isSameValue = selectedValue !== null && cellData.value === selectedValue;
            const isConflict = conflicts.has(`${r}-${c}`);
            
            const cellContainerClasses = [
                'relative bg-slate-800',
                (c === 2 || c === 5) ? 'border-r-2 border-r-slate-500' : '',
                (r === 2 || r === 5) ? 'border-b-2 border-b-slate-500' : '',
            ].join(' ');

            return (
                <div key={`${r}-${c}`} className={cellContainerClasses}>
                    <Cell
                        cellData={cellData}
                        isSelected={isSelected}
                        isPeer={isCellPeer}
                        isSameValue={isSameValue}
                        isConflict={isConflict}
                        onClick={() => handleCellClick(r, c)}
                    />
                </div>
            );
            })
        )}
        </div>
    </div>
  );
};

export default SudokuGrid;
