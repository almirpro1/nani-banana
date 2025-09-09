import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { generateImage, editImage } from './services/geminiService';
import { AspectRatio, HistoryItem } from './types';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      if (!header || !data) {
        reject(new Error("Invalid file format"));
        return;
      }
      const mimeTypeMatch = header.match(/:(.*?);/);
      if (!mimeTypeMatch || !mimeTypeMatch[1]) {
        reject(new Error("Could not determine mime type"));
        return;
      }
      const mimeType = mimeTypeMatch[1];
      resolve({ base64: data, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

function App() {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // State lifted from ControlPanel
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [seed, setSeed] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setOutputImage(null);
    try {
      const numericSeed = seed.trim() === '' ? undefined : parseInt(seed, 10);
      if (seed.trim() !== '' && (isNaN(numericSeed!) || !Number.isInteger(numericSeed))) {
        throw new Error("A seed deve ser um número inteiro.");
      }
      
      const imageUrl = await generateImage(prompt, aspectRatio, numericSeed);
      setOutputImage(imageUrl);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        prompt,
        inputImage: null,
        outputImage: imageUrl,
        timestamp: new Date(),
        aspectRatio,
        seed: numericSeed,
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setOutputImage(null);
    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const inputImage = `data:${mimeType};base64,${base64}`;
      const outputImageUrl = await editImage({
        prompt,
        base64ImageData: base64,
        mimeType
      });
      setOutputImage(outputImageUrl);
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        prompt,
        inputImage,
        outputImage: outputImageUrl,
        timestamp: new Date(),
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (e: any) {
        setError(e.message || 'Ocorreu um erro desconhecido.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setOutputImage(item.outputImage);
    setPrompt(item.prompt);
    
    if (item.inputImage) {
        setMode('edit');
        setImagePreview(item.inputImage);
        setImageFile(null); // Can't restore the file object
        setSeed('');
        setAspectRatio('1:1');
    } else {
        setMode('generate');
        setAspectRatio(item.aspectRatio || '1:1');
        setSeed(item.seed !== undefined ? String(item.seed) : '');
        setImageFile(null);
        setImagePreview(null);
    }
  }, []);

  const handleSubmit = () => {
      if (mode === 'generate') {
          handleGenerate();
      } else {
          handleEdit();
      }
  };

  return (
    <div className="bg-base-100 min-h-screen text-text-primary font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-4 lg:p-8 flex-grow">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
          <div className="xl:col-span-3">
             <ControlPanel 
                mode={mode}
                setMode={setMode}
                prompt={prompt}
                setPrompt={setPrompt}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                seed={seed}
                setSeed={setSeed}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
             />
          </div>
          <div className="xl:col-span-6">
            <OutputPanel outputImage={outputImage} isLoading={isLoading} error={error} />
          </div>
           <div className="xl:col-span-3">
            <HistoryPanel history={history} onSelect={handleSelectHistoryItem} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;