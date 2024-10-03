import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Dashboard, DashboardByRole } from "@/pages/Dashboard";
import { ExploreProviderById } from "@/pages/Dashboard/components/ExploreProviderById";
import { ExploreProviders } from "@/pages/Dashboard/components/ExploreProviders";
import { MySubscriptionById } from "@/pages/Dashboard/components/MySubscriptionById";
import { MySubscriptions } from "@/pages/Dashboard/components/MySubscriptions";
import { Wallet } from "@/pages/Dashboard/components/Wallet";
import { Home } from "@/pages/Home";
import { Providers } from "@/providers";

import { APP_ROUTES } from "./constants";

//TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const router: any = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.DASHBOARD.HOME} element={<Dashboard />}>
        <Route index element={<DashboardByRole />} />
        <Route path={APP_ROUTES.DASHBOARD.WALLET} element={<Wallet />} />
        <Route
          path={APP_ROUTES.DASHBOARD.EXPLORE_PROVIDERS}
          element={<ExploreProviders />}
        />
        <Route
          path={APP_ROUTES.DASHBOARD.MY_SUBSCRIPTIONS}
          element={<MySubscriptions />}
        />
        <Route
          path={APP_ROUTES.DASHBOARD.PROVIDER(":providerId")}
          element={<MySubscriptionById />}
        />
        <Route
          path={APP_ROUTES.DASHBOARD.PROVIDER_SUBSCRIPTIONS(":providerId")}
          element={<ExploreProviderById />}
        />
      </Route>
    </Route>,
  ),
);
