import { fetchAPI } from "./client";

export async function getTables() {
  const result = await fetchAPI(
    "/tables?limit=100&include=all&fields=owners,tags,columns,usageSummary",
  );
  return result.data || [];
}
