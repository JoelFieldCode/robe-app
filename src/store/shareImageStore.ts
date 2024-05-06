import { create } from "zustand";

export const useShareImageStore = create<{
    image: File | null;
    title: string | null;
    text: string | null;
    url: string | null;
    reset: () => void;
}>((set) => ({
    image: null,
    title: null,
    text: null,
    url: null,
    reset: () => set({ image: null, title: null, text: null, url: null }),
}));