import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ProvidersType } from "@/constants/columns/explore";
import { MySubscription } from "@/constants/columns/mySubscriptions";

interface Store {
  totalSpent: string;
  mySubscriptions: Array<MySubscription>;
  providers: Array<ProvidersType>;
  totalExpenses: Array<{ provider: string; value: number }>;
}

interface Actions {
  setMySubscriptions: (subscriptions: Array<MySubscription>) => void;
  setProviders: (subscriptions: Array<ProvidersType>) => void;
}

const totalExpenses = [
  { provider: "Rozetka", value: 186 },
  { provider: "Youtube", value: 305 },
  { provider: "Apple Music", value: 237 },
  { provider: "Discord", value: 73 },
  { provider: "Chat GPT", value: 4 },
];

export const useConsumer = create<Store & Actions>()(
  immer((set) => ({
    totalSpent: totalExpenses.reduce(
      (acc, { value }) => (Number(acc) + value).toString(),
      "0",
    ),
    mySubscriptions: [],
    providers: [],
    totalExpenses: totalExpenses,

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
  })),
);
