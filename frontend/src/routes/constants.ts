export const CONSUMER_PAGE = {
  MY_SUBSCRIPTIONS: "my-subscriptions",
  EXPLORE_PROVIDERS: "explore_providers",
  get PROVIDER() {
    return (providerId: string) => this.MY_SUBSCRIPTIONS + `/${providerId}`;
  },
  get PROVIDER_SUBSCRIPTIONS() {
    return (providerId: string) => this.EXPLORE_PROVIDERS + `/${providerId}`;
  },
} as const;

export const PROVIDER_PAGE = {
  SERVICES: "services",
  get SERVICE() {
    return (services: string) => this.SERVICES + `/${services}`;
  },
};

export const APP_ROUTES = {
  HOME: "/",

  THINK_FORGE: "/think-forge",

  DASHBOARD: {
    HOME: "/dashboard/:role",
    TO_HOME: (role: string) => `/dashboard/${role}`,
    WALLET: "wallet",
    ...CONSUMER_PAGE,
    ...PROVIDER_PAGE,
  },

  DEFAULT: "*",
} as const;
