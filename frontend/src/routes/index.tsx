import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Dashboard, DashboardByRole } from "@/pages/Dashboard";
import { ExploreProviderById } from "@/pages/Dashboard/components/ExploreProviderById";
import { ExploreProviders } from "@/pages/Dashboard/components/ExploreProviders";
import { Followers } from "@/pages/Dashboard/components/Followers";
import { FollowersById } from "@/pages/Dashboard/components/FollowersById";
import { MySubscriptionById } from "@/pages/Dashboard/components/MySubscriptionById";
import { MySubscriptions } from "@/pages/Dashboard/components/MySubscriptions";
import ProtectedRoute from "@/pages/Dashboard/components/ProtectedRoute";
import { Wallet } from "@/pages/Dashboard/components/Wallet";
import { loaderDashboard } from "@/pages/Dashboard/loaders";
import { Home } from "@/pages/Home";
import { Providers } from "@/providers";
import { APP_ROUTES } from "@/routes/constants";
console.log("router");

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />

      <Route
        path={APP_ROUTES.DASHBOARD.HOME}
        loader={loaderDashboard}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
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

        <Route path={APP_ROUTES.DASHBOARD.FOLLOWERS} element={<Followers />} />
        <Route
          path={APP_ROUTES.DASHBOARD.FOLLOWER(":follower")}
          element={<FollowersById />}
        />
      </Route>

      <Route
        path={APP_ROUTES.DEFAULT}
        element={<Navigate replace to={APP_ROUTES.HOME} />}
      />
    </Route>,
  ),
);
