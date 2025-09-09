export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface HistoryItem {
  id: string;
  prompt: string;
  inputImage: string | null;
  outputImage: string;
  timestamp: Date;
  seed?: number;
  aspectRatio?: AspectRatio;
}