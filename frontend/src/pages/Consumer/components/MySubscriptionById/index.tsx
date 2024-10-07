import { ExternalLinkIcon } from "lucide-react";
import { Link, generatePath, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { tokens } from "@/constants/columns/tokens";
import { useConsumer } from "@/hooks/store/useConsumer";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";
import { formatTokenAmount } from "@/utils";
// import { calculatePeriodInMonths } from "@/utils";

export const MySubscriptionById = () => {
  const mySubscriptions = useConsumer((store) => store.mySubscriptions);
  const { providerId, role } = useParams<{ providerId: string; role: Role }>();

  const subscription = mySubscriptions.find(
    (el) => providerId && el.serviceId === providerId,
  );
  if (!subscription || !role) return null;
  const token = tokens[subscription.mint];
  const handleAction = () =>
    subscription.isActive
      ? console.log(`Unsubscribe from ID ${subscription.serviceId}`)
      : console.log(
          `Renew your subscription with ID ${subscription.serviceId}`,
        );

  // const period = calculatePeriodInMonths(
  //   subscription.startDate,
  //   subscription.endDate,
  // );

  const actionText = subscription.isActive ? "Cancel" : "Resume";

  return (
    <div className="flex flex-col gap-4 h-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to={generatePath(
                APP_ROUTES.DASHBOARD.HOME +
                  "/" +
                  APP_ROUTES.DASHBOARD.MY_SUBSCRIPTIONS,
                {
                  role,
                },
              )}
            >
              <BreadcrumbLink className="text-secondary-foreground">
                My Subscriptions
              </BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-secondary-foreground" />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-28 truncate">
              {subscription.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="flex flex-col justify-between p-4 rounded-xl">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-bold flex flex-row justify-center items-center max-w-28 truncate">
            {subscription.name} <ExternalLinkIcon className="h-4" />
          </h2>
          <Badge
            className={subscription.isActive ? "bg-green-500" : "bg-red-500"}
          >
            {subscription.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="pt-2 gap-3">
          <div className="mb-2 flex justify-between items-center">
            <h4 className="text-base font-medium">Payment token</h4>
            <div className="flex items-center">
              <img
                src={token.logoURI}
                alt={token.name}
                className="h-7 w-7 mr-2 rounded-full"
              />
              <p className="text-gray-500 text-base font-medium">
                {token.name}
              </p>
            </div>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <h4 className="text-base font-medium">Contract ID</h4>
            <p className="text-gray-500 text-base font-medium">
              {subscription.mint}
            </p>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <h4 className="text-base font-medium">Subscription Period</h4>
            <p className="text-gray-500 text-base font-medium">
              {subscription.subscriptionPeriod}
            </p>
          </div>

          <div className="mb-2 flex justify-between items-center">
            <h4 className="text-base font-medium">Price</h4>
            <p className="text-gray-500 text-base font-medium">
              <span>
                {formatTokenAmount(
                  subscription.subPrice,
                  token.decimals,
                ).toString()}
              </span>{" "}
              {token.symbol}
            </p>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <h4 className="text-base font-medium">Last Payment</h4>
            <p className="text-gray-500 text-base font-medium">
              {new Date(subscription.lastPayment * 1000).toLocaleDateString()}
            </p>
          </div>
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-base font-medium">Authority</h4>
            <p className="text-gray-500 text-base font-medium">
              {subscription.authority}
            </p>
          </div>
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-base font-medium">URL</h4>
            <a
              href={subscription.url}
              className="text-gray-500 text-base font-medium max-w-28 truncate"
            >
              {subscription.url}
            </a>
          </div>
        </div>
        <Separator className="mb-4" />
        <Button
          onClick={handleAction}
          variant={subscription.isActive ? "default" : "destructive"}
        >
          {actionText}
        </Button>
      </Card>
    </div>
  );
};
