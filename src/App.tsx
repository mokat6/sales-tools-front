import { useEffect, useState } from "react";
import type { CompanyDto } from "./api/ApiTypes";
import { apiClient } from "./api/ApiClient";
import { Button } from "./components/Button";
import PopoverDemo from "./components/PopoverDemo";
import { ThemeSelect } from "./components/ThemeSelect";

function App() {
  const checkin = () => {
    // console.log(companies);
  };

  return (
    <>
      <div className="flex flex-col gap-20  items-center pt-6">
        <Button>submit to me</Button>

        <h1>Popover soon</h1>

        <PopoverDemo />

        <ThemeSelect />
      </div>
    </>
  );
}

export default App;
