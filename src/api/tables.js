import { fetchAPI, patchTable } from "./client";

export async function getTables() {
  try {
    const result = await fetchAPI(
      "/tables?limit=100&include=all&fields=owners,tags,columns,usageSummary",
    );
    return result.data || [];
  } catch (err) {
    throw new Error("Failed to fetch tables");
  }
}

export async function updateTableOwner(tableId, ownerName, showToast) {
  try {
    await patchTable(tableId, [
      { op: "add", path: "/owners", value: [{ name: ownerName, type: "team" }] },
    ]);
    return true;
  } catch (err) {
    showToast("Failed to assign owner", "error");
    return false;
  }
}

export async function updateTableDescription(tableId, description, showToast) {
  try {
    await patchTable(tableId, [
      { op: "add", path: "/description", value: description },
    ]);
    return true;
  } catch (err) {
    showToast("Failed to update description", "error");
    return false;
  }
}

export async function addPIITags(tableId, columnNames, showToast) {
  try {
    await patchTable(
      tableId,
      columnNames.map((_, i) => ({
        op: "add",
        path: `/columns/${i}/tags`,
        value: [
          {
            tagFQN: "PII.Sensitive",
            source: "Tag",
            labelType: "Manual",
            state: "Confirmed",
          },
        ],
      })),
    );
    return true;
  } catch (err) {
    showToast("Failed to add PII tags", "error");
    return false;
  }
}