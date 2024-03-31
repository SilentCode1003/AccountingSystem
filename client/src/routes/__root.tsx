import { QueryClient, useQuery } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Navigate,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: async ({ context: { queryClient }, navigate }) => {
    const data = await queryClient.ensureQueryData({
      queryKey: ["CurrentUser"],
      queryFn: async () => {
        const response = await fetch("http://localhost:3000/login", {
          credentials: "include",
        });

        let data;

        data = (await response.json()) as Promise<{
          isLogged: boolean;
          user: {
            userId: string;
            userType: string;
          };
        }>;

        return data;
      },
    });
    return data;
  },
  component: RootComponent,
});

function RootComponent() {
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

  return (
    <>
      {isSuccess && !data.isLogged && <Navigate to="/login" />}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
