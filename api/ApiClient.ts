import { SwaggerSdk } from "./SwaggerSdk";

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
  getCompanies: async () => swaggerSdk.company(),
  getContacts: async (compId: number) => swaggerSdk.contact(compId),
};
