import Sidebar from "./Sidebar";
import { Route, Routes } from "react-router-dom";
import ViewBigData from "./ViewBigData";
import AddCompanyScreen from "./AddCompanyScreen";
import Settings from "./Settings";
import Crm from "./Crm";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [sideMenuOpen, setSideMenuOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenuBase className="absolute">
        <MenuIcon size={29} onClick={() => setSideMenuOpen(!sideMenuOpen)} className="cursor-pointer" />
      </SideMenuBase>

      {sideMenuOpen && <Sidebar Base={SideMenuBase} />}
      <div className="flex-1 overflow-auto bg-bg-background">
        <Routes>
          <Route path="/" element={<ViewBigData />} />
          <Route path="/newCompany" element={<AddCompanyScreen />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/crm" element={<Crm />} />
        </Routes>
      </div>
    </div>
  );
}

export type SideMenuBaseProps = {
  children: React.ReactNode;
  className: string;
};

const SideMenuBase = ({ className, children }: SideMenuBaseProps) => {
  return <div className={`flex w-12 bg-amber-400 flex-col items-center pt-4 gap-4 ${className}`}>{children}</div>;
};
