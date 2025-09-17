import React from 'react';

interface NumberPaletteProps {
  onNumberSelect: (num: number | null) => void;
  selectedNumber: number | null;
}

const NumberPalette: React.FC<NumberPaletteProps> = ({ onNumberSelect, selectedNumber }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-lg mx-auto mt-4 flex justify-center items-center gap-2 px-2 py-2 bg-slate-800/50 rounded-lg shadow-lg">
      {numbers.map(num => (
        <button
          key={num}
          onClick={() => onNumberSelect(num)}
          className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-bold text-2xl rounded-md transition-all duration-200
            ${selectedNumber === num ? 'bg-cyan-500 text-white shadow-lg scale-110' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}
          `}
          aria-pressed={selectedNumber === num}
          aria-label={`Select number ${num}`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onNumberSelect(null)}
        className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-md transition-all duration-200 ml-2
          ${selectedNumber === null ? 'bg-cyan-500 text-white shadow-lg scale-110' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}
        `}
        aria-pressed={selectedNumber === null}
        aria-label="Erase number"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default NumberPalette;
