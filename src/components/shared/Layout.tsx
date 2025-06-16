
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Shield } from "lucide-react";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">HR-ассистент</h1>
        </div>
        <nav className="flex flex-col space-y-1 p-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <Home className="h-4 w-4" />
            Главная
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <Shield className="h-4 w-4" />
            Админ
          </NavLink>
        </nav>
      </aside>
      <main className="flex flex-1 flex-col sm:ml-60">
        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
