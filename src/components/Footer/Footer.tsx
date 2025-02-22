import { Home, Plus, User } from "lucide-react";
import React, { ReactNode, isValidElement, cloneElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../@/lib/utils";

const links: { name: string; href: string; icon: ReactNode }[] = [
  {
    name: "Home",
    href: "/",
    icon: <Home />,
  },
  {
    name: "Create",
    href: "/items/create",
    icon: <Plus />,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: <User />,
  },
];

export const Footer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        {links.map(({ href, icon, name }) => {
          return (
            <button
              key={name}
              type="button"
              disabled={pathname === href}
              onClick={() => {
                if (pathname === href) {
                  return;
                }
                navigate(href);
              }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {isValidElement(icon) &&
                cloneElement<any>(icon, {
                  className: cn(
                    "w-7 h-7 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500",
                    {
                      "text-blue-600": pathname === href,
                    }
                  ),
                  "aria-hidden": "true",
                })}
              <span
                className={cn(
                  "text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500",
                  {
                    "text-blue-600": pathname === href,
                  }
                )}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
