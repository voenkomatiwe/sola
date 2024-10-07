import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Store {
  myServices: Array<{ name: string }>;
}

interface Actions {
  setMyServices: (services: Array<{ name: string }>) => void;
}

export const useProvider = create<Store & Actions>()(
  immer((set) => ({
    myServices: [],

    setMyServices: (myServices) => {
      set((state) => {
        state.myServices = myServices;
      });
    },
  })),
);
