import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Dashboard, DashboardByRole } from "@/pages/Dashboard";
import { Explore } from "@/pages/Dashboard/components/Explore";
import { MySubscriptions } from "@/pages/Dashboard/components/MySubscriptions";
import { Wallet } from "@/pages/Dashboard/components/Wallet";
import { Home } from "@/pages/Home";
import { Providers } from "@/providers";

import { APP_ROUTES } from "./constants";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.DASHBOARD.HOME} element={<Dashboard />}>
        <Route index element={<DashboardByRole />} />
        <Route path={APP_ROUTES.DASHBOARD.WALLET} element={<Wallet />} />
        <Route path={APP_ROUTES.DASHBOARD.EXPLORE} element={<Explore />} />
        <Route
          path={APP_ROUTES.DASHBOARD.MY_SUBSCRIPTIONS}
          element={<MySubscriptions />}
        />
      </Route>
    </Route>,
  ),
);
