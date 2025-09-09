import React, { useState, useEffect } from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { BananaIcon } from './icons/BananaIcon';


const loadingMessages = [
    "Gerando sua obra-prima...",
    "Polindo os pixels...",
    "Consultando a musa da IA...",
    "Um momento, a magia está acontecendo...",
    "Despertando a criatividade neural...",
];

const LoadingSpinner: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-text-secondary">
            <svg className="animate-spin h-12 w-12 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg transition-opacity duration-500">{message}</p>
        </div>
    );
};


const Placeholder: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8 border-2 border-dashed border-base-300 rounded-xl flex flex-col items-center justify-center gap-4 text-text-muted">
            <div className="bg-base-100 p-4 rounded-full">
                <BananaIcon className="w-16 h-16 text-brand-yellow" />
            </div>
            <h3 className="text-2xl font-semibold text-text-primary">Estúdio Nano Banana</h3>
            <p>Sua tela em branco para a criatividade.<br /> Descreva uma imagem, clique em "Gerar" e veja a mágica acontecer.</p>
        </div>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-red-400 bg-red-900/20 p-8 rounded-lg">
        <h3 className="text-2xl font-semibold">Ocorreu um Erro</h3>
        <p className="text-center">{message}</p>
    </div>
);

// FIX: Define prop types for the OutputPanel component.
interface OutputPanelProps {
  outputImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ outputImage, isLoading, error }) => {
  const handleDownload = () => {
    if (!outputImage) return;
    const link = document.createElement('a');
    link.href = outputImage;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // A imagem gerada é jpeg, então forçamos a extensão
    link.download = `nano-banana-studio-${timestamp}.jpeg`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-base-200 rounded-lg shadow-xl p-4 w-full h-full min-h-[400px] lg:min-h-0 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : outputImage ? (
          <div className="relative group w-full h-full flex items-center justify-center">
            <img
              src={outputImage}
              alt="Generated output"
              className="max-w-full max-h-full object-contain rounded-md shadow-lg"
            />
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-brand-yellow text-base-100 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
              aria-label="Salvar imagem"
              title="Salvar imagem"
            >
              <DownloadIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
};