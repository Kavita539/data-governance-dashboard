import { fetchAPI, patchTable } from "./client";

export async function getTables() {
  const result = await fetchAPI(
    "/tables?limit=100&include=all&fields=owners,tags,columns,usageSummary",
  );
  return result.data || [];
}

export async function updateTableOwner(tableId, ownerName) {
  await patchTable(tableId, [
    { op: 'add', path: '/owners', value: [{ name: ownerName, type: 'team' }] }
  ]);
  return true;
}

export async function updateTableDescription(tableId, description) {
  await patchTable(tableId, [
    { op: 'add', path: '/description', value: description }
  ]);
  return true;
}

export async function addPIITags(tableId, columnNames) {
  await patchTable(tableId,
    columnNames.map((_, i) => ({
      op: 'add',
      path: `/columns/${i}/tags`,
      value: [{ tagFQN: 'PII.Sensitive', source: 'Tag', labelType: 'Manual', state: 'Confirmed' }]
    }))
  );
  return true;
}