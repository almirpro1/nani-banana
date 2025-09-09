import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from '../types';

// FIX: Initialize GoogleGenAI with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Implement image generation using the 'imagen-4.0-generate-001' model.
export const generateImage = async (prompt: string, aspectRatio: AspectRatio, seed?: number): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
        seed: seed,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Nenhuma imagem foi gerada. A resposta pode conter informações de segurança.");
    }
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw new Error("Falha ao gerar a imagem. Por favor, verifique o console para mais detalhes.");
  }
};

interface EditImageParams {
    prompt: string;
    base64ImageData: string;
    mimeType: string;
}

// FIX: Implement image editing using the 'gemini-2.5-flash-image-preview' model.
export const editImage = async ({ prompt, base64ImageData, mimeType }: EditImageParams): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageMimeType = part.inlineData.mimeType;
                return `data:${imageMimeType};base64,${base64ImageBytes}`;
            }
        }
        
        throw new Error("Nenhuma imagem foi retornada na edição. A resposta pode ter sido bloqueada.");
    } catch (error) {
        console.error("Erro ao editar imagem:", error);
        throw new Error("Falha ao editar a imagem. Por favor, verifique o console para mais detalhes.");
    }
};