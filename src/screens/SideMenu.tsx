import { NavLink } from "react-router-dom";
import { LayoutDashboard, MenuIcon, Settings } from "lucide-react";

import { useEffect, useState } from "react";

const MENU_ITEMS = [
  { to: "", icon: <LayoutDashboard size={29} />, label: "Dashboard" },
  // { to: "newCompany", icon: <Building size={29} />, label: "New Company" },
  { to: "settings", icon: <Settings size={29} />, label: "Settings" },
  // { to: "crm", icon: <Swords size={29} />, label: "CRM or PK" },
];

export default function SideMenu() {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(() => {
    const stored = localStorage.getItem("sideMenuOpen");
    if (stored === null) return true;

    try {
      return JSON.parse(stored);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("sideMenuOpen", JSON.stringify(sideMenuOpen));
  }, [sideMenuOpen]);

  return (
    <div
      className={`flex w-12 bg-bg-table flex-col items-center py-3 gap-4 select-none
    border-r border-border transition-[width] overflow-hidden  ${sideMenuOpen ? "satatic" : "absolute"}`}
    >
      <MenuIcon size={29} onClick={() => setSideMenuOpen(!sideMenuOpen)} className="cursor-pointer" />
      {sideMenuOpen &&
        MENU_ITEMS.map(({ to, icon }) => {
          return (
            <NavLink
              to={to}
              key={to}
              className={({ isActive }) =>
                `transition-all duration-300 transform animate-slide-in ${
                  isActive ? "text-text-body" : "text-action-primary"
                }`
              }
            >
              {icon}
            </NavLink>
          );
        })}
    </div>
  );
}
