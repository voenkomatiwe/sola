import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLinkIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, generatePath, useParams } from "react-router-dom";
import { z } from "zod";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tokens } from "@/constants/columns/tokens";
import { useConsumer } from "@/hooks/store/useConsumer";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";

const formSchema = z.object({
  token: z.string().min(1, {
    message: "Please select a token.",
  }),
  period: z.string().min(1, {
    message: "Please select a period.",
  }),
  amount: z.number().positive({
    message: "Amount must be positive.",
  }),
});

export function ExploreProviderById() {
  const providers = useConsumer((store) => store.providers);
  const { providerId, role } = useParams<{ providerId: string; role: Role }>();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
      period: "",
      amount: 0,
    },
  });

  const provider = providers.find((el) => providerId && el.id === providerId);

  const paymentToken = provider?.mint ? tokens[provider.mint] : null;

  useEffect(() => {
    if (paymentToken && provider?.subscriptionPeriod) {
      const calculatedAmount = Number(provider.subPrice || 0);
      form.setValue("amount", calculatedAmount);
      form.setValue("period", provider.subscriptionPeriod);
    }
  }, [paymentToken, provider?.subscriptionPeriod]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Success!",
      description: `You have subscribed with ${values.amount} for ${values.period} month(s) using ${values.token}.`,
    });
  }

  if (!provider || !role || !paymentToken) return null;

  return (
    <div className="flex flex-col gap-4 h-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to={generatePath(
                APP_ROUTES.DASHBOARD.HOME +
                  "/" +
                  APP_ROUTES.DASHBOARD.EXPLORE_PROVIDERS,
                {
                  role,
                },
              )}
            >
              <BreadcrumbLink className="text-secondary-foreground">
                Explore Providers
              </BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-secondary-foreground" />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-28 truncate">
              {provider.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="p-6 shadow-md rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center max-w-28 truncate">
          {provider.name}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Select a Payment Token</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          variant="outline"
                          type="single"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <ToggleGroupItem
                            key={paymentToken.address}
                            value={paymentToken.address}
                            className="flex gap-2"
                          >
                            <img
                              src={paymentToken.logoURI}
                              alt={paymentToken.name}
                              className="w-5 h-5 rounded-full"
                            />
                            {paymentToken.name}
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Subscription Period</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          variant="outline"
                          type="single"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <ToggleGroupItem
                            key={provider.subscriptionPeriod}
                            value={provider.subscriptionPeriod}
                          >
                            {provider.subscriptionPeriod} month(s)
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Amount"
                      {...field}
                      value={field.value}
                      readOnly
                    />
                  </FormControl>
                  <FormDescription>
                    The amount will be calculated based on your subscription
                    period and price.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Subscribe
            </Button>
          </form>
        </Form>
      </Card>
      <div className="flex justify-between items-end mt-auto">
        <a className="flex gap-2 items-end text-blue-600 hover:underline ">
          <span className="max-w-28 truncate">{provider.name}</span>
          <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}
