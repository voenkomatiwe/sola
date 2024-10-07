import { LoaderFunction, redirect } from "react-router-dom";

import { Role } from "@/interfaces";
import { APP_ROUTES, CONSUMER_PAGE, PROVIDER_PAGE } from "@/routes/constants";

const getUserRoleFromUrl = (url: URL): Role | null => {
  const pathParts = url.pathname.split("/");
  const role = pathParts[2];

  if (role === "consumer") {
    return "consumer";
  } else if (role === "provider") {
    return "provider";
  }
  return null;
};

export const loaderDashboard = (async ({ request }) => {
  const url = new URL(request.url);
  const role = getUserRoleFromUrl(url);
  if (role === "consumer") {
    const isTryingToAccessProviderPage = url.pathname.includes(
      PROVIDER_PAGE.SERVICES,
    );
    if (isTryingToAccessProviderPage) {
      return redirect(APP_ROUTES.DASHBOARD.TO_HOME("consumer"));
    }
    return null;
  } else if (role === "provider") {
    const isTryingToAccessConsumerPage =
      url.pathname.includes(CONSUMER_PAGE.MY_SUBSCRIPTIONS) ||
      url.pathname.includes(CONSUMER_PAGE.EXPLORE_PROVIDERS);
    if (isTryingToAccessConsumerPage) {
      return redirect(APP_ROUTES.DASHBOARD.TO_HOME("provider"));
    }
    return null;
  }

  return redirect(APP_ROUTES.DASHBOARD.TO_HOME("consumer"));
}) satisfies LoaderFunction;
