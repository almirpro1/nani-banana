import React from 'react';
import { HistoryItem } from '../types';
import { ImageIcon } from './icons/ImageIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  const getTooltipText = (item: HistoryItem): string => {
    let tooltip = `Prompt: ${item.prompt}`;
    if (item.inputImage === null) { // Generation item
        if (item.aspectRatio) {
            tooltip += `\nProporção: ${item.aspectRatio}`;
        }
        if (item.seed !== undefined) {
            tooltip += `\nSeed: ${item.seed}`;
        }
    }
    return tooltip;
  };

  return (
    <div className="bg-base-200 rounded-lg shadow-xl p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-text-primary border-b border-base-300 pb-2">Histórico</h2>
      {history.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-text-muted text-center">
          <ImageIcon className="w-16 h-16 opacity-30 mb-4" />
          <p>Seu histórico de imagens aparecerá aqui.</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 focus-within:ring-2 focus-within:ring-brand-purple"
                onClick={() => onSelect(item)}
                title={getTooltipText(item)}
                tabIndex={0}
              >
                <img
                  src={item.outputImage}
                  alt={item.prompt}
                  className="w-full h-auto object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                   <div className="flex items-start gap-2">
                    {/* FIX: Pass a <title> element as a child for accessibility and tooltips, instead of using a 'title' prop. */}
                    {item.inputImage ? (
                        <ImageIcon className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5">
                          <title>Editada</title>
                        </ImageIcon>
                    ) : (
                        <SparklesIcon className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5">
                          <title>Gerada</title>
                        </SparklesIcon>
                    )}
                    <p className="text-white text-xs line-clamp-2">{item.prompt}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};