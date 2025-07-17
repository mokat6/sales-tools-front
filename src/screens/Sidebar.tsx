import { NavLink } from "react-router-dom";
import { Building, LayoutDashboard, MenuIcon, PanelRightClose, Settings, Swords } from "lucide-react";

import { useState, type JSX } from "react";
import type { SideMenuBaseProps } from "./App";

const MENU_ITEMS = [
  { value: "hamburger", label: <MenuIcon size={29} /> },
  { value: "", label: <LayoutDashboard size={29} /> },
  { value: "newCompany", label: <Building size={29} /> },
  { value: "settings", label: <Settings size={29} /> },
  { value: "crm", label: <Swords size={29} /> },
];

type SidebarProps = {
  Base: ({ className, children }: SideMenuBaseProps) => JSX.Element;
};

export default function Sidebar({ Base }: SidebarProps) {
  return (
    <Base className={`border-r border-gray-400 transition-[width] overflow-hidden  bg-gray-200 `}>
      {MENU_ITEMS.map(({ value, label }) => {
        return (
          <MenuItem to={value} key={value}>
            {label}
          </MenuItem>
        );
      })}
    </Base>
  );
}

const MenuItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <div>
      <NavLink to={to} className={({ isActive }) => (isActive ? "text-text-body" : "text-action-primary")}>
        {children}
      </NavLink>
    </div>
  );
};
