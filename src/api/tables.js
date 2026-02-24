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

export async function getTeams() {
  try {
    const response = await fetchAPI("/teams");
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function updateTableOwner(tableId, ownerId, showToast) {
  try {
    await patchTable(tableId, [
      {
        op: "add",
        path: "/owners",
        value: [
          {
            id: ownerId,
            type: "team",
          },
        ],
      },
    ]);
    return true;
  } catch (err) {
    showToast("Failed to assign owner: Check if team exists", "error");
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

export async function addPIITags(table, columnNames, showToast) {
  if (!table?.columns) {
    showToast("Table data is missing", "error");
    return false;
  }

  try {
    const operations = columnNames
      .map((colName) => {
        const index = table.columns.findIndex((c) => c.name === colName);

        if (index === -1) return null;

        return {
          op: "add",
          path: `/columns/${index}/tags/0`,
          value: {
            tagFQN: "PII.Sensitive",
            source: "Classification",
            labelType: "Manual",
            state: "Confirmed",
          },
        };
      })
      .filter(Boolean);

    if (operations.length === 0) return false;

    await patchTable(table.id, operations);
    return true;
  } catch (err) {
    showToast("Server rejected tag format", "error");
    return false;
  }
}
