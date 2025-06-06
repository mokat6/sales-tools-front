// import like this only if you need to work with types, like type programming, generate new stuff.
// import type { ICompanyDto, IContactDto, ContactType } from "./OpenApiSdk";

// export type { ICompanyDto, IContactDto, ContactType };

export type { ICompanyDto, IContactDto, ContactType } from "./SwaggerSdk";

// only exports types of the Class, not the implementation, only for TS
export { type CompanyDto } from "./SwaggerSdk";

export const compClassificationOptions = {
  Unspecified: "",
  GoodMatch: "Good match",
  FuckYou: "Fuck you",
  Ecommerce: "E-commerce",
  GimmeSomeLove: "Gimme Some Love",
} as const;
