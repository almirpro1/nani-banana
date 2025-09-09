import React from 'react';
import { BananaIcon } from './icons/BananaIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-100/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-3 p-4">
        <div className="bg-brand-yellow p-2 rounded-lg">
            <BananaIcon className="w-6 h-6 text-base-100" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Estúdio Nano Banana
          </h1>
          <p className="text-xs text-text-muted">
            Powered by Gemini 2.5 Flash
          </p>
        </div>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-base-300 to-transparent"></div>
    </header>
  );
};