import Sidebar from "./Sidebar";
import { Route, Routes } from "react-router-dom";
import ViewBigData from "./ViewBigData";
import AddCompanyScreen from "./AddCompanyScreen";
import Settings from "./Settings";
import Crm from "./Crm";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
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
