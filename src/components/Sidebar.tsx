import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Scale,
  UserPlus,
  Inbox,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps) => {
  const user = getCurrentUser();
  const userRole = user?.role || "individual";

  // Base nav items for all users
  const baseNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", path: "/documents", icon: FileText },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ];

  // Role-specific nav items
  const lawyerNavItems = [
    {
      name: "Client Management",
      path: "/lawyer/assign-client",
      icon: UserPlus,
    },
  ];

  const clientNavItems = [
    { name: "My Lawyer", path: "/client/assignment-requests", icon: Scale },
  ];

  const adminNavItems = [{ name: "Users", path: "/admin/users", icon: Users }];

  // Build nav items based on role
  let navItems = [...baseNavItems];

  if (userRole === "lawyer") {
    navItems = [...baseNavItems, ...lawyerNavItems];
  } else if (userRole === "individual") {
    navItems = [...baseNavItems, ...clientNavItems];
  } else if (userRole === "admin") {
    navItems = [...baseNavItems, ...adminNavItems];
  }

  // Add settings at the end
  navItems.push({ name: "Settings", path: "/settings", icon: Settings });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col
          fixed z-40 transition-all duration-300
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isCollapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Logo & Toggle */}
        <div
          className={`p-6 border-b border-sidebar-border flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`transition-opacity duration-300 overflow-hidden ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">
              ⚖️ LegalAnalyzer
            </h1>
            <p className="text-sm text-sidebar-foreground/60 mt-1 whitespace-nowrap">
              AI Document Analysis
            </p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground flex-shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`relative flex items-center gap-3 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group ${
                isCollapsed ? "px-0 justify-center" : "px-4"
              }`}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-full"
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={`transition-opacity duration-300 whitespace-nowrap overflow-hidden ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 w-full ${
              isCollapsed ? "px-0 justify-center" : "px-4"
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`transition-opacity duration-300 whitespace-nowrap overflow-hidden ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
