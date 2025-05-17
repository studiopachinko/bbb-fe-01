import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <main className="place-content-center place-items-center bg-stone-300 h-[100vh]">
      <div className="min-w-[400px] p-2 bg-white max-w-[400px] min-h-[800px] max-h-[800px] relative">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </main>
  ),
});
