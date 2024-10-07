import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { ExploreProviderById } from "@/pages/Consumer/components/ExploreProviderById";
import { ExploreProviders } from "@/pages/Consumer/components/ExploreProviders";
import { MySubscriptionById } from "@/pages/Consumer/components/MySubscriptionById";
import { MySubscriptions } from "@/pages/Consumer/components/MySubscriptions";
import { Dashboard, DashboardByRole } from "@/pages/Dashboard";
import ProtectedRoute from "@/pages/Dashboard/components/ProtectedRoute";
import { Wallet } from "@/pages/Dashboard/components/Wallet";
import { loaderDashboard } from "@/pages/Dashboard/loaders";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Provider/components/Services";
import { ServicesById } from "@/pages/Provider/components/ServicesById";
import { ThinkForge } from "@/pages/ThinkForge";
import { Providers } from "@/providers";
import { APP_ROUTES } from "@/routes/constants";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.THINK_FORGE} element={<ThinkForge />} />

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

        <Route path={APP_ROUTES.DASHBOARD.SERVICES} element={<Services />} />
        <Route
          path={APP_ROUTES.DASHBOARD.SERVICE(":service")}
          element={<ServicesById />}
        />
      </Route>

      <Route
        path={APP_ROUTES.DEFAULT}
        element={<Navigate replace to={APP_ROUTES.HOME} />}
      />
    </Route>,
  ),
);
