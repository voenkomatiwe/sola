import { Pencil1Icon, PlusCircledIcon } from "@radix-ui/react-icons"; // Radix icons

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export const Provider = () => {
  const providerName = "Youtube";
  const followersCount = 124;
  const tokensCount = 5;

  return (
    <div>
      <CardHeader className="bg-blue-600 text-white py-4 px-6 rounded-t-lg flex items-center justify-between">
        <h2 className="text-xl font-bold">{providerName}</h2>
        <Avatar>
          <AvatarImage
            src="https://cdn3.iconfinder.com/data/icons/social-network-30/512/social-06-1024.png"
            alt="Avatar"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </CardHeader>

      <CardContent className="p-6 bg-card">
        <p className="text-gray-700 mb-4">
          Welcome to the provider dashboard. Here you can manage your services
          and followers.
        </p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold">{followersCount}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{tokensCount}</p>
            <p className="text-sm text-gray-500">Tokens Provided</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 border-t bg-card">
        <Button className="flex items-center">
          <Pencil1Icon className="mr-2" />
          Edit Profile
        </Button>
        <Button className="flex items-center">
          <PlusCircledIcon className="mr-2" />
          Add Token
        </Button>
      </CardFooter>
    </div>
  );
};
