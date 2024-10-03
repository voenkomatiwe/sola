import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
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
import { statusColors } from "@/constants/columns/mySubscriptions";
import { tokens } from "@/constants/columns/tokens";
import { useConsumer } from "@/hooks/store/useConsumer";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";
import { calculatePeriodInMonths } from "@/utils";

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

  const period = calculatePeriodInMonths(
    subscription.startDate,
    subscription.endDate,
  );
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

      <Card className="flex justify-between p-4 rounded-xl">
        <h2 className="text-lg font-bold">{subscription.name}</h2>
        <Badge className={statusColors[subscription.status]}>
          {subscription.status.charAt(0).toUpperCase() +
            subscription.status.slice(1)}
        </Badge>
      </Card>
      <Card className="flex flex-col p-4 gap-2 border border-gray-300 rounded-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Payment token</h3>
          <div className="flex items-center mb-2">
            <img
              src={token.logoURI}
              alt={token.name}
              className="h-7 w-7 mr-2 rounded-full"
            />
            <p className="font-medium">{token.name}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Contract ID</h3>
          <p className="text-gray-500">{subscription.token}</p>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Amount</h3>
          <p>
            <span className="text-gray-500 font-medium">
              {subscription.amount}
            </span>
            {token.symbol}
          </p>
        </div>
      </Card>
      <Card className="flex justify-between items-end p-4 rounded-xl">
        <div className="text-left flex flex-col gap-2">
          <p className="font-bold">Start</p>
          <p className="text-gray-600">{subscription.startDate}</p>
        </div>
        <Badge className="text-sm">{`${period} month${period > 1 ? "s" : ""}`}</Badge>
        <div className="text-right flex flex-col gap-2">
          <p className="font-bold">Finish</p>
          <p className="text-gray-600">{subscription.endDate}</p>
        </div>
      </Card>
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
      <div className="flex justify-between items-end mt-auto">
        <div className="flex gap-4">
          <GitHubLogoIcon className="w-8 h-8" />
          <DiscordLogoIcon className="w-8 h-8" />
          <LinkedInLogoIcon className="w-8 h-8" />
        </div>
        <a className="flex gap-2 items-center">
          {subscription.name} <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
};
