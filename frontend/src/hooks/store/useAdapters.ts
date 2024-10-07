import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ServiceAdapter, UserAdapter } from "@/lib/contract";
import { SubscriptionAdapter } from "@/lib/contract/subscriptionAdapter";

interface Store {
  user: UserAdapter;
  service: ServiceAdapter;
  subscription: SubscriptionAdapter;
}

interface Actions {
  setAdaptors: (props: Partial<Store>) => void;
}

export const useAdapters = create<Partial<Store> & Actions>()(
  immer((set) => ({
    user: undefined,
    service: undefined,
    subscription: undefined,

    setAdaptors: (props) => {
      set((state) => {
        const { service, user, subscription } = props;
        if (service) state.service = service;
        if (user) state.user = user;
        if (subscription) state.subscription = subscription;
      });
    },
  })),
);
