import type { CompanyDto } from "../api/SwaggerSdk";
import { formatters } from "./formatters";

export default function formatCompany(company?: CompanyDto): Record<string, React.ReactNode> {
  if (!company) return {};

  return {
    id: formatters.plainText(company.id),
    "Company name": formatters.plainText(company.companyName),
    Country: formatters.plainText(company.country),
    City: formatters.plainText(company.city),
    "Full address": formatters.plainText(company.fullAddress),
    Website: formatters.url(company.website),
    "Category Google": formatters.plainText(company.categoryGoogle),
    "Rating Google": formatters.plainText(company.ratingGoogle),
    "Rated Count": formatters.plainText(company.ratedCount),
    "Google maps url": formatters.url(company.googleMapsUrl),
    "BigFish score": formatters.plainText(company.bigFishScore),
    Classification: formatters.plainText(
      company.classification?.map((c) => formatters.companyClassification(c)).join(", ")
    ),
  };
}
