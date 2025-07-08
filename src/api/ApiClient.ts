import { dtoToJsonPatch as dtoToJsonPatchOperations } from "./dtoToJsonPatch";
import { CreateContactDto, SwaggerSdk, type ICompanyDto, type ICreateContactDto } from "./SwaggerSdk";

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
  // getCompanies: swaggerSdk.listCompanies,  // won't work because "this" loses context in the class method
  getCompanies: async ({ pageIndex, pageSize }: { pageIndex?: number; pageSize?: number }) =>
    swaggerSdk.listCompanies(pageIndex, pageSize),
  getCompaniesCursor: async (p?: getCompaniesCursorProps) =>
    swaggerSdk.listCompaninesWithCursor(p?.pageSize, p?.cursor, p?.search, p?.sortBy, p?.sortDirection),
  getContacts: async (compId: number) => await swaggerSdk.getCompanyContacts(compId),
  deleteCompany: async (compId: number) => await swaggerSdk.deleteCompany(compId),
  patchCompany: async ({ compId, body }: { compId: number; body: ICompanyDto }) => {
    // if you forget to await here, Tanstack query onSuccess won't wait either.
    return await swaggerSdk.patchCompany(compId, dtoToJsonPatchOperations(body));
  },
  getCompany: async (compId: number) => swaggerSdk.getCompany(compId),
  createContact: async (newContact: ICreateContactDto) => {
    const dto = CreateContactDto.fromJS(newContact);
    return await swaggerSdk.createCompanyContact(dto);
  },
};

type getCompaniesCursorProps = {
  pageSize?: number;
  cursor?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
};
