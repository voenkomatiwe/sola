import { zodResolver } from "@hookform/resolvers/zod";
import BN from "bn.js";
import { ExternalLinkIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tokens } from "@/constants/columns/tokens";
import { useConsumer } from "@/hooks/store/useConsumer";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/interfaces";
import { APP_ROUTES } from "@/routes/constants";
import { formatTokenAmount } from "@/utils";

const formSchema = z.object({
  token: z.string().min(1, {
    message: "Please select a token.",
  }),
  period: z.string().min(1, {
    message: "Please select a period.",
  }),
  amount: z.string().min(1, {
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
      amount: "0",
    },
  });

  const provider = providers.find((el) => providerId && el.id === providerId);

  const paymentToken = provider?.mint ? tokens[provider.mint] : null;

  const value = useWatch({ control: form.control });

  useEffect(() => {
    if (!provider || !paymentToken) return;
    const price = new BN(provider.subPrice)
      .mul(new BN(value.period || "0"))
      .toString();
    const readablePrice = formatTokenAmount(price, paymentToken.decimals);
    form.setValue("amount", readablePrice);
  }, [form, paymentToken, provider, value.period]);

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
            <BreadcrumbPage className="max-w-56 truncate">
              {provider.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="p-6 shadow-md rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center max-w-56 truncate">
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
                          <ToggleGroupItem value="1">1 month</ToggleGroupItem>
                          <ToggleGroupItem value="3">3 months</ToggleGroupItem>
                          <ToggleGroupItem value="6">6 months</ToggleGroupItem>
                          <ToggleGroupItem value="12">
                            12 months
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Subscribe {value.amount} {paymentToken.symbol}
            </Button>
          </form>
        </Form>
      </Card>
      <div className="flex justify-between items-end mt-auto">
        <a className="flex gap-2 items-end text-blue-600 hover:underline ">
          <span className="max-w-56 truncate">{provider.name}</span>
          <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}
