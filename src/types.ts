import { CompClassification } from "./api/SwaggerSdk";

export const CompClassificationLabels: Record<CompClassification, string> = {
  [CompClassification.Unspecified]: "",
  [CompClassification.GoodMatch]: "Good match",
  [CompClassification.FuckYou]: "Not a good match",
  [CompClassification.Ecommerce]: "E-commerce",
  [CompClassification.GimmeSomeLove]: "Needs some love",
};

export const stringToCompClassification = (label: string): CompClassification => {
  for (const [key, value] of Object.entries(CompClassification)) {
    if (value === label) {
      return key as CompClassification;
    }
  }

  return CompClassification.Unspecified;
};
