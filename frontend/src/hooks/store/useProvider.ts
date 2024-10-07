import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ProvidersType } from "@/constants/columns/explore";

interface Store {
  myServices: Array<ProvidersType>;
}

interface Actions {
  setMyServices: (services: Array<ProvidersType>) => void;
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
