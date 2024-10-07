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
import { statusColors } from "@/constants/columns/mySubscriptions";
import { tokens } from "@/constants/columns/tokens";
import { useConsumer } from "@/hooks/store/useConsumer";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";
// import { calculatePeriodInMonths } from "@/utils";

export const MySubscriptionById = () => {
  const mySubscriptions = useConsumer((store) => store.mySubscriptions);
  const { providerId, role } = useParams<{ providerId: string; role: Role }>();

  const subscription = mySubscriptions.find(
    (el) => providerId && el.id === Number(providerId),
  );
  if (!subscription || !role) return null;
  const token = tokens[subscription.token];
  const handleAction = () => {
    switch (subscription.status) {
      case "pending":
      case "processing":
        console.log(`Unsubscribe from ID ${subscription.id}`);
        break;
      case "cancelled":
      case "ended":
        console.log(`Renew your subscription with ID ${subscription.id}`);
        break;
      default:
        break;
    }
  };

  // const period = calculatePeriodInMonths(
  //   subscription.startDate,
  //   subscription.endDate,
  // );

  const actionText =
    subscription.status === "pending" || subscription.status === "processing"
      ? "Cancel"
      : "Resume";

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
            <BreadcrumbPage>{subscription.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="flex flex-col justify-between p-4 rounded-xl">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-bold flex flex-row justify-center items-center">
            {subscription.name} <ExternalLinkIcon className="h-4" />
          </h2>
          <Badge className={statusColors[subscription.status]}>
            {subscription.status.charAt(0).toUpperCase() +
              subscription.status.slice(1)}
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
            <h3 className="text-base font-medium">Contract ID</h3>
            <p className="text-gray-500 text-base">{subscription.token}</p>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-base font-medium">Amount</h3>
            <p className="text-gray-500 text-base font-medium">
              <span>{subscription.amount}</span> {token.symbol}
            </p>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-base font-medium">Start</h3>
            <p className="text-gray-500 text-base font-medium">
              {subscription.startDate}
            </p>
          </div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-base font-medium">End</h3>
            <p className="text-gray-500 text-base font-medium">
              {subscription.endDate}
            </p>
          </div>
        </div>
        <Separator className="mb-4" />
        <Button
          onClick={handleAction}
          variant={
            subscription.status === "pending" ||
            subscription.status === "processing"
              ? "destructive"
              : "default"
          }
        >
          {actionText}
        </Button>
      </Card>
    </div>
  );
};
