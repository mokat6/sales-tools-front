import { NavLink } from "react-router-dom";
import { PanelRightClose } from "lucide-react";

import { useState } from "react";

const MENU_ITEMS = [
  { value: "", label: "View big data" },
  { value: "newCompany", label: "New Company" },
  { value: "settings", label: "Settings" },
  { value: "crm", label: "CRM" },
];
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const togglePanel = () => setExpanded(!expanded);

  return (
    <div
      className={` flex flex-col border-r border-gray-400 transition-[width] overflow-hidden  bg-gray-200 ${
        expanded ? "w-35" : "w-10"
      }`}
    >
      <PanelRightClose
        className={`self-end cursor-pointer ${expanded ? "rotate-180" : ""} transition`}
        onClick={togglePanel}
      />
      {MENU_ITEMS.map(({ value, label }) => {
        return (
          <MenuItem to={value} key={value}>
            {expanded ? label : label[0]}
          </MenuItem>
        );
      })}
    </div>
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
