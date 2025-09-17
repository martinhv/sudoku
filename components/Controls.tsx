import React from 'react';
import { InputMode } from '../types';

interface ControlsProps {
  difficulty: number;
  onDifficultyChange: (level: number) => void;
  onGenerate: () => void;
  onClear: () => void;
  onSolve: () => void;
  isLoading: boolean;
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
}

const getDifficultyName = (cellsToRemove: number): string => {
    if (cellsToRemove <= 35) return 'Easy';
    if (cellsToRemove <= 45) return 'Medium';
    if (cellsToRemove <= 55) return 'Hard';
    return 'Expert';
};

const Controls: React.FC<ControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onGenerate,
  onClear,
  onSolve,
  isLoading,
  inputMode,
  onInputModeChange,
}) => {
  const buttonBaseClasses = "px-4 py-2 font-semibold rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const primaryButtonClasses = "bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-cyan-800 disabled:text-slate-400 disabled:cursor-not-allowed focus:ring-cyan-400";
  const secondaryButtonClasses = "bg-slate-600 text-slate-100 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed focus:ring-slate-500";

  const difficultyName = getDifficultyName(difficulty);
  const difficultyColor = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-orange-400',
    Expert: 'text-red-500',
  }[difficultyName];

  return (
    <div className="w-full max-w-lg mx-auto mt-6 p-4 bg-slate-800/50 rounded-lg shadow-lg">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex justify-between items-center mb-2">
              <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300">
              Difficulty
              </label>
              <span className={`text-sm font-semibold ${difficultyColor}`}>
                  {difficultyName} ({81 - difficulty} clues)
              </span>
          </div>
          <input
            id="difficulty"
            type="range"
            min="20"
            max="60"
            step="1"
            value={difficulty}
            onChange={(e) => onDifficultyChange(parseInt(e.target.value, 10))}
            disabled={isLoading}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
            "
          />
        </div>
        <div>
            <div className="flex justify-center items-baseline gap-2 mb-2">
              <label className="text-sm font-medium text-slate-300">Input Mode</label>
              <span className="text-xs text-slate-400 font-light">(Press 'i')</span>
            </div>
            <div className="relative flex w-full p-1 bg-slate-700 rounded-md">
                <button
                    onClick={() => onInputModeChange('normal')}
                    className={`w-1/2 rounded py-1 text-sm font-semibold transition-colors duration-300 ${inputMode === 'normal' ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
                    aria-pressed={inputMode === 'normal'}
                >
                    Normal
                </button>
                <button
                    onClick={() => onInputModeChange('notes')}
                    className={`w-1/2 rounded py-1 text-sm font-semibold transition-colors duration-300 ${inputMode === 'notes' ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
                    aria-pressed={inputMode === 'notes'}
                >
                    Notes
                </button>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={onGenerate} disabled={isLoading} className={`${buttonBaseClasses} ${primaryButtonClasses}`}>
          Generate Puzzle
        </button>
        <button onClick={onClear} disabled={isLoading} className={`${buttonBaseClasses} ${secondaryButtonClasses}`}>
          Clear Board
        </button>
        <button onClick={onSolve} disabled={isLoading} className={`${buttonBaseClasses} ${secondaryButtonClasses}`}>
          Solve Puzzle
        </button>
      </div>
    </div>
  );
};

export default Controls;