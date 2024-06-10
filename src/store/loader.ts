import { create } from "zustand";

export type Loader = {
  loaderState: boolean;
};

type LoaderState = {
  loaderState: boolean;
  setLoaderState: (state: boolean) => void;
};

export const useLoaderState = create<LoaderState>((set) => ({
  loaderState: false,
  setLoaderState: (state) => set(() => ({ loaderState: state })),
}));
