import { useEffect, useState } from "react";
import type { CompanyDto } from "./api/ApiTypes";
import { apiClient } from "./api/ApiClient";
import { Button } from "./components/Button";
import { ThemeSelect } from "./components/ThemeSelect";
import { KeyValue } from "./components/KeyValue";
import { DataGrid } from "./components/DataGrid";
import { DG1 } from "./components/dataGrid/DG1";
import { DG2groups } from "./components/dataGrid/DG2groups";
import { DebouncedInput, DG3 } from "./components/dataGrid/DG3";
import { DG4 } from "./components/dataGrid/DG4";
import { DG6_column_Ordering } from "./components/dataGrid/DG6_column_Ordering";

function App() {
  const checkin = () => {
    // console.log(companies);
  };

  const kvData = {
    id: 0,
    country: "Germany",
    city: "Offenbach am Main",
    website: "http://069-it.de/",
  };

  return (
    <>
      <div className="flex flex-col gap-20  items-center pt-6 bg-background">
        <Button>submit to me</Button>

        <h1>Popover soon</h1>

        <ThemeSelect />

        <KeyValue keyTitle="kkk" valueTitle="vvv" data={kvData} />

        {/* <DG1 /> */}

        {/* <DG2groups /> */}
        {/* <DG3 /> */}
        {/* <DebouncedInput className="border" value={""} onChange={() => console.log("fuck")} /> */}

        {/* <DG4 /> */}

        <DG6_column_Ordering />
      </div>
    </>
  );
}

export default App;
