import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useForm } from "react-hook-form";
// import { v4 } from "uuid";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customServiceId } from "@/config";
import { tokens } from "@/constants/columns/tokens";
import { useAdapters } from "@/hooks/store/useAdapters";
import { useToast } from "@/hooks/use-toast";
import { parseTokenAmount } from "@/utils";

const formSchema = z.object({
  mint: z.string().min(1, { message: "Please select a token." }),
  name: z.string().min(1, { message: "Name is required." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
  subPrice: z
    .string()
    .min(1, { message: "Subscription price must be positive." }),
  subscriptionPeriod: z
    .string()
    .min(1, { message: "Subscription period must be positive." })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SubscriptionFormModal() {
  const serviceAdapter = useAdapters((store) => store.service);
  const { publicKey } = useWallet();

  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mint: "",
      name: "",
      url: "",
      subPrice: "",
      subscriptionPeriod: undefined,
    },
  });

  const onSubmit = async (values: FormData) => {
    if (!serviceAdapter || !publicKey) return;

    const decimals = tokens[values.mint].decimals;
    console.log("parse", values.subPrice);
    console.log(parseTokenAmount(values.subPrice, decimals));

    const createServiceTx = await serviceAdapter.createService({
      //TODO: uncomment
      // id: v4(),
      id: customServiceId,
      authority: publicKey,
      mint: new PublicKey(values.mint),
      subPrice: parseTokenAmount(values.subPrice, decimals),
      subscriptionPeriod: values.subscriptionPeriod
        ? new BN(values.subscriptionPeriod)
        : undefined,
      name: values.name,
      url: values.url,
    });

    toast({
      title: "Success!",
      description: createServiceTx,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer shadow-lg hover:shadow transition-shadow w-fit bg-gradient-to-r from-slate-200 to-zinc-200 rounded-lg">
          <CardHeader>
            <CardTitle>Ready to Build Your New Service?</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline">Click on me</Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your new subscription</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Token</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full [&>span]:flex [&>span]:gap-3 [&>span]:items-center">
                        <SelectValue placeholder="Choose a token..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(tokens).map((token) => (
                          <SelectItem
                            key={token.address}
                            value={token.address}
                            className="[&>span]:flex [&>span]:gap-3 [&>span]:items-center"
                          >
                            <img
                              src={token.logoURI}
                              alt={token.name}
                              className="w-5 h-5 rounded-full"
                            />
                            {token.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subscription name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscriptionPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Period (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter period (in months)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
