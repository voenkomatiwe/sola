import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Dashboard } from "@/pages/Dashboard";
import { Home } from "@/pages/Home";
import { Providers } from "@/providers";

import { APP_ROUTES } from "./constants";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
    </Route>,
  ),
);
