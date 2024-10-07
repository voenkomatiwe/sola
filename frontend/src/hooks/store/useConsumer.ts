import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ProvidersType } from "@/constants/columns/explore";
import { MySubscription } from "@/constants/columns/mySubscriptions";
import { TOKEN_ADDRESSES } from "@/constants/columns/tokens";

interface Store {
  totalSpent: string;
  mySubscriptions: Array<MySubscription>;
  providers: Array<ProvidersType>;
  totalExpenses: Array<{ provider: string; value: number }>;
}

interface Actions {
  setMySubscriptions: (subscriptions: Array<MySubscription>) => void;
}

const mySubscriptions: Array<MySubscription> = [
  {
    id: 1,
    name: "Rozetka",
    amount: "999",
    token: TOKEN_ADDRESSES.SOL,
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "processing",
  },
  {
    id: 2,
    name: "Youtube",
    amount: "2.99",
    token: TOKEN_ADDRESSES.USDC,
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "processing",
  },
];

const providers: Array<ProvidersType> = [
  {
    id: 1,
    name: "Rozetka",
    tokens: [
      {
        amount: "2",
        token: TOKEN_ADDRESSES.SOL,
      },
    ],
    periods: [1, 3],
  },
  {
    id: 2,
    name: "Youtube",
    tokens: [
      {
        amount: "2.99",
        token: TOKEN_ADDRESSES.USDC,
      },
      {
        amount: "2.99",
        token: TOKEN_ADDRESSES.SOL,
      },
    ],
    periods: [1, 3, 12],
  },
];

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
    mySubscriptions: mySubscriptions,
    providers: providers,
    totalExpenses: totalExpenses,

    setMySubscriptions: (subscriptions) => {
      set((state) => {
        state.mySubscriptions = subscriptions;
      });
    },
  })),
);
