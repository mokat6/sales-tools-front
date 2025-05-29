import { useEffect, useState } from "react";
import type { CompanyDto } from "./api/ApiTypes";
import { apiClient } from "./api/ApiClient";
import { Button } from "./components/Button";
import { ThemeSelect } from "./components/ThemeSelect";
import { KeyValue } from "./components/KeyValue";
import { DataTable } from "./components/dataTables/DataTable";
import { Select } from "./components/Select";
import ClassificationSelector from "./components/ClassificationSelector";

function App() {
  const [data, setData] = useState<CompanyDto[]>([]);
  const [keyValueData, setKeyValueData] = useState<CompanyDto | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await apiClient.getCompanies();
        setData(response);
      } catch (e) {
        console.log(`Error fetching data: ${e}`);
      }
    };
    run();
  }, []);

  // const onRowSelect = (row: CompanyDto | null) => {
  //   console.log("row selected > ", row);
  //   setKey
  // }

  return (
    <>
      <div className="flex gap-20  items-start pt-6 bg-background">
        <section className="">
          <DataTable data={data} onRowSelect={setKeyValueData} />
        </section>
        <section className="flex flex-col">
          <div className="flex flex-col text-text-body">
            <span>Company ID:</span>
            <span className="text-3xl self-center min-h-12">{keyValueData?.id ?? " "}</span>
          </div>

          <ClassificationSelector id={keyValueData?.id ?? ""} value={keyValueData?.classification ?? ""} />

          <Button>submit to me</Button>
          <h1 onClick={() => console.log(data)}>Popover soon</h1>
          <ThemeSelect />
        </section>
        <section className="">
          <KeyValue keyTitle="kkk" valueTitle="vvv" data={keyValueData} />
        </section>
      </div>
    </>
  );
}

export default App;
