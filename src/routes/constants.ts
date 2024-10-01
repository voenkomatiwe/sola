import { Role } from "@/interfaces";

export const APP_ROUTES = {
  HOME: "/",

  DASHBOARD: {
    HOME: "/dashboard/:role",
    TO_HOME: (role: Role) => `/dashboard/${role}`,
    WALLET: "wallet",
    MY_SUBSCRIPTIONS: "my-subscriptions",
    SUBSCRIPTIONS: "subscriptions",
    get PROVIDER() {
      return (providerId: string) => this.MY_SUBSCRIPTIONS + `/${providerId}`;
    },
    get PROVIDER_SUBSCRIPTIONS() {
      return (providerId: string) => this.SUBSCRIPTIONS + `/${providerId}`;
    },
  },

  DEFAULT: "*",
} as const;
