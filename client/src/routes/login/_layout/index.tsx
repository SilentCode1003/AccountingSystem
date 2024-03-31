import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login/_layout/")({
  component: login,
});

type LoginPayload = {
  username: string;
  password: string;
};

function login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: LoginPayload) => {
      await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["CurrentUser"] });
    },
  });

  const { data, isSuccess } = useQuery({
    queryKey: ["CurrentUser"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/login", {
        credentials: "include",
      });

      const data = (await response.json()) as Promise<{
        isLogged: boolean;
        user: {
          userId: string;
          userType: string;
        };
      }>;

      return data;
    },
  });

  const handleLogin = () => {
    login.mutate({ username, password });
    navigate({ to: "/login" });
  };

  if (isSuccess && data.isLogged) return <Navigate to="/" />;
  return (
    <div className=" h-[95vh] max-h-[95vh] flex flex-col gap-4 md:flex-row">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div>
          <img
            className="w-40 md:w-80"
            src="https://www.5lsolutions.com/wp-content/uploads/2023/03/FiveL-1.png"
          />
        </div>
        <Text variant={"heading1bold"}>Acounting System</Text>
      </div>
      <Separator orientation="horizontal" className="md:hidden" />
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="flex-1 flex items-center justify-center px-8 pb-8 md:pb-0">
        <div>
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col gap-2 items-center md:items-start">
              <Text variant={"heading1bold"} className="font-thin md:font-bold">
                Login
              </Text>
              <Text
                variant={"heading4ghost"}
                className="text-center md:text-start "
              >
                Enter your username and password to login!
              </Text>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full">
                <Label>Username</Label>
                <Input
                  className="w-full"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  className="w-full"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleLogin} className="w-full mt-2">
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login;
