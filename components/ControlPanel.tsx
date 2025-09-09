import React, { useState, useRef } from 'react';
import { AspectRatio } from '../types';
import { TextIcon } from './icons/TextIcon';
import { ImageIcon } from './icons/ImageIcon';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { DiceIcon } from './icons/DiceIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ControlPanelProps {
  mode: 'generate' | 'edit';
  setMode: (mode: 'generate' | 'edit') => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  seed: string;
  setSeed: (seed: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Quadrado (1:1)' },
  { value: '16:9', label: 'Paisagem (16:9)' },
  { value: '9:16', label: 'Retrato (9:16)' },
  { value: '4:3', label: 'Paisagem (4:3)' },
  { value: '3:4', label: 'Retrato (3:4)' },
];

const inspirationalPrompts = [
    "Um astronauta surfando em uma onda cósmica em um mar de estrelas.",
    "Uma cidade flutuante nos céus de um planeta alienígena ao pôr do sol.",
    "Uma floresta encantada com árvores que brilham no escuro e animais falantes.",
    "Um robô vintage cuidando de um jardim de flores de cristal.",
    "Um dragão majestoso dormindo em uma montanha de moedas de ouro sob a lua cheia.",
];


export const ControlPanel: React.FC<ControlPanelProps> = ({ 
    mode, setMode,
    prompt, setPrompt,
    aspectRatio, setAspectRatio,
    seed, setSeed,
    imageFile, setImageFile,
    imagePreview, setImagePreview,
    onSubmit,
    isLoading 
}) => {
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const handleInspireMe = () => {
    const randomIndex = Math.floor(Math.random() * inspirationalPrompts.length);
    setPrompt(inspirationalPrompts[randomIndex]);
  };

  const handleRandomizeSeed = () => {
    const randomSeed = Math.floor(Math.random() * 2147483647);
    setSeed(String(randomSeed));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    onSubmit();
  };
  
  const handleModeChange = (newMode: 'generate' | 'edit') => {
      setMode(newMode);
      if (newMode === 'generate') {
          setImageFile(null);
          setImagePreview(null);
      }
  }

  return (
    <div className="bg-base-200 rounded-lg shadow-xl p-6 h-full flex flex-col">
       <div className="bg-base-100 p-1 rounded-full flex items-center mb-6">
        <button
          className={`flex-1 text-center rounded-full p-2 text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${mode === 'generate' ? 'bg-brand-purple text-white shadow' : 'text-text-muted hover:bg-base-300/50'}`}
          onClick={() => handleModeChange('generate')}
        >
          <SparklesIcon className="w-5 h-5" />
          Gerar
        </button>
        <button
          className={`flex-1 text-center rounded-full p-2 text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${mode === 'edit' ? 'bg-brand-purple text-white shadow' : 'text-text-muted hover:bg-base-300/50'}`}
          onClick={() => handleModeChange('edit')}
        >
          <ImageIcon className="w-5 h-5" />
          Editar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-4">
        <div className="relative flex-grow min-h-[150px] flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary">
                Prompt de Comando
              </label>
              <button type="button" onClick={handleInspireMe} disabled={isLoading} className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1">
                  <DiceIcon className="w-4 h-4" />
                  Inspire-me
              </button>
            </div>
            <TextIcon className="absolute top-10 left-3 w-5 h-5 text-text-muted pointer-events-none" />
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'generate' ? "Descreva a imagem que você quer criar..." : "Descreva a edição que você quer fazer..."}
                className="w-full pl-10 h-full flex-grow resize-none bg-base-100 rounded-md p-2 border border-base-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-shadow"
                required
                disabled={isLoading}
            />
        </div>

        {mode === 'edit' && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Imagem para Editar</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {imagePreview ? (
                <div className="relative group p-2 border border-base-300 rounded-lg">
                    <img src={imagePreview} alt="Pré-visualização" className="w-full h-auto max-h-48 object-contain mx-auto rounded-md" />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-base-100/70 backdrop-blur-sm rounded-full p-1 text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remover imagem"
                        title="Remover imagem"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={handleImageUploadClick}
                    className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center cursor-pointer hover:border-brand-purple hover:bg-base-300/20 transition-colors"
                >
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                        <UploadIcon className="w-8 h-8" />
                        <span className="text-sm">Clique para carregar uma imagem</span>
                    </div>
                </div>
            )}
          </div>
        )}

        {mode === 'generate' && (
          <div className="flex flex-col gap-2">
            <div className="border-t border-base-300"></div>
            <button type="button" onClick={() => setAdvancedSettingsOpen(!advancedSettingsOpen)} className="flex justify-between items-center w-full text-left font-semibold text-text-secondary hover:text-text-primary py-2">
                <span>Configurações Avançadas</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${advancedSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
            {advancedSettingsOpen && (
              <div className="flex flex-col gap-4 pt-2">
                <div className="relative">
                    <label htmlFor="seed" className="block text-sm font-medium text-text-secondary mb-1">Seed</label>
                    <div className="flex items-center gap-2">
                        <input
                            id="seed"
                            type="text"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="Aleatório"
                            className="w-full bg-base-100 rounded-md p-2 border border-base-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-shadow"
                            disabled={isLoading}
                        />
                        <button type="button" onClick={handleRandomizeSeed} className="p-2 rounded-md bg-base-300 hover:bg-brand-purple text-text-primary transition-colors" aria-label="Gerar seed aleatória" title="Gerar seed aleatória">
                            <DiceIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                  <label htmlFor="aspectRatio" className="block text-sm font-medium text-text-secondary mb-1">Proporção</label>
                  <select
                    id="aspectRatio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="select w-full appearance-none bg-base-100 rounded-md p-2 border border-base-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-shadow"
                    disabled={isLoading}
                  >
                    {aspectRatios.map(ratio => (
                      <option key={ratio.value} value={ratio.value} className="bg-base-200">{ratio.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute top-9 right-4 w-5 h-5 text-text-muted pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-auto py-3 px-4 rounded-lg font-bold text-base-100 bg-brand-yellow hover:bg-yellow-300 disabled:bg-base-300 disabled:text-text-muted transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
          disabled={isLoading || !prompt || (mode === 'edit' && !imageFile && !imagePreview)}
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-5 w-5 border-b-2 border-base-100 rounded-full"></span>
              Processando...
            </>
          ) : (
            <>{mode === 'generate' ? 'Gerar Imagem' : 'Editar Imagem'}</>
          )}
        </button>
      </form>
    </div>
  );
};