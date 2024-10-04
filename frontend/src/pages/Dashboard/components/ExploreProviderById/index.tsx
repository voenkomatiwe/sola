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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const subscriptions = useConsumer((store) => store.providers);
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

  const provider = subscriptions.find(
    (el) => providerId && el.id === Number(providerId),
  );

  const paymentTokens = provider?.tokens.map((el) => {
    const { symbol, logoURI, name } = tokens[el.token];
    return {
      amount: el.amount,
      symbol,
      icon: logoURI,
      name,
      address: el.token,
    };
  });

  useEffect(() => {
    const subscriptionToken = paymentTokens?.find(
      (token) => token.address === form.getValues("token"),
    );
    const subscriptionPeriod = provider?.periods.find(
      (period) => period.toString() === form.getValues("period"),
    );

    if (subscriptionToken && subscriptionPeriod) {
      const calculatedAmount =
        Number(subscriptionToken.amount || 0) * +subscriptionPeriod;
      form.setValue("amount", calculatedAmount);
    }
  }, [form.watch("token"), form.watch("period")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Success!",
      description: `You have subscribed with ${values.amount} for ${values.period} month(s) using ${values.token}.`,
    });
  }
  if (!provider || !role || !paymentTokens) return null;

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
            <BreadcrumbPage>{provider.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="p-6 shadow-md rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center">{provider.name}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select a Payment Token</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-1"
                      >
                        {paymentTokens.map((token) => (
                          <FormItem
                            key={token.address}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={token.address} />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <img
                                src={token.icon}
                                alt={token.name}
                                className="w-5 h-5"
                              />
                              {token.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Period</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-1"
                      >
                        {provider.periods.map((period) => (
                          <FormItem
                            key={period}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={period.toString()} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {period} month(s)
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
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
                    The amount will be calculated based on your token and
                    subscription period.
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
        <a className="flex gap-2 items-end text-blue-600 hover:underline">
          {provider.name} <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}
