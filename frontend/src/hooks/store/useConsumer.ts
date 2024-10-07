import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ProvidersType } from "@/constants/columns/explore";
import { MySubscription } from "@/constants/columns/mySubscriptions";

interface Store {
  totalSpent: string;
  mySubscriptions: Array<MySubscription>;
  providers: Array<ProvidersType>;
  totalExpenses: Array<{ token: string; value: string }>;
}

interface Actions {
  setMySubscriptions: (subscriptions: Array<MySubscription>) => void;
  setProviders: (subscriptions: Array<ProvidersType>) => void;
  setTotalExpenses: (
    totalExpenses: Array<{ token: string; value: string }>,
  ) => void;
}

export const useConsumer = create<Store & Actions>()(
  immer((set) => ({
    totalSpent: "0",
    mySubscriptions: [],
    providers: [],
    totalExpenses: [],

    setMySubscriptions: (subscriptions) => {
      set((state) => {
        state.mySubscriptions = subscriptions;
      });
    },

    setProviders: (providers) => {
      set((state) => {
        state.providers = providers;
      });
    },

    setTotalExpenses: (totalExpenses) => {
      set((state) => {
        state.totalExpenses = totalExpenses;
        state.totalSpent = totalExpenses.reduce(
          (acc, { value }) => (Number(acc) + value).toString(),
          "0",
        );
      });
    },
  })),
);
