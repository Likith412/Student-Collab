import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import UserContext from "../contexts/UserContext";
import {
  Home,
  Search,
  FolderOpen,
  User,
  Calendar,
  Bell,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const isActive = path => location.pathname === path;

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("jwtToken");
    // Clear user from context
    setUser(null);
    // Redirect to home page
    navigate("/");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home, protected: false },
    { path: "/discover", label: "Discover", icon: Search, protected: false },
    { path: "/projects", label: "My Projects", icon: FolderOpen, protected: true },
    { path: "/profile", label: "Profile", icon: User, protected: true },
  ];

  return (
    <nav className="bg-card border-b shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-xl font-bold text-foreground">Student Collab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6">
            {navItems.map(item => {
              const Icon = item.icon;
              if (item.protected && !user) {
                return null;
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-smooth text-sm font-medium ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions - only show on desktop (xl and above) */}
          <div className="hidden xl:flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/projects/create">
                    <span className="hidden lg:inline">Post Project</span>
                    <span className="lg:hidden">Post</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-1 lg:mr-2" />
                    <span className="hidden lg:inline">Login</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/register">
                    <UserPlus className="w-4 h-4 mr-1 lg:mr-2" />
                    <span className="hidden lg:inline">Register</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/projects/create">
                    <span className="hidden lg:inline">Post Project</span>
                    <span className="lg:hidden">Post</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile/Tablet menu button */}
          <div className="xl:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation */}
        {isMobileMenuOpen && (
          <div className="xl:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="flex flex-col space-y-2 pt-2 border-t">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                      <span className="ml-auto w-2 h-2 bg-destructive rounded-full"></span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link
                        to="/projects/create"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Post Project
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link
                        to="/projects/create"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Post Project
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
