import { dtoToJsonPatch as dtoToJsonPatchOperations } from "./dtoToJsonPatch";
import { CompanyDto, SwaggerSdk } from "./SwaggerSdk";

const BASE_URL = "http://localhost:5243";

const myFetch = async (url: RequestInfo, init?: RequestInit) => {
  const customInit = {
    ...init,
    headers: {
      ...(init?.headers || {}),
      // Authorization: `Bearer ${yourToken}`,
      "X-Custom-Header-lol": "hello ;)",
    },
  };
  return fetch(url, customInit);
};

const swaggerSdk = new SwaggerSdk(BASE_URL, { fetch: myFetch });

export const apiClient = {
  getCompanies: async () => swaggerSdk.listCompanies(),
  getContacts: async (compId: number) => swaggerSdk.getCompanyContacts(compId),
  deleteCompany: async (compId: number) => swaggerSdk.deleteCompany(compId),
  patchCompany: async ({ compId, body }: { compId: number; body: CompanyDto }) => {
    console.log("!!!!", compId, body);
    swaggerSdk.patchCompany(compId, dtoToJsonPatchOperations(body));
  },
};
