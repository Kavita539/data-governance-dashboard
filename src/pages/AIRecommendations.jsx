import { useState } from "react";
import { Alert, Box, Grid, Typography } from "@mui/material";

import DetailPanel from "../components/AIRecommendations/DetailPanel";
import TableList from "../components/AIRecommendations/TableList";
import StatsBar from "../components/AIRecommendations/StatsBar";
import Loader from "../components/Loader/Loader";

import { useTables } from "../context/TableContext";

import { addPIITags, updateTableDescription, updateTableOwner } from "../api";
import { detectIssues, generateRecommendations } from "../api/governance";

export default function AIRecommendations() {
  const { tables, loading, error, refresh } = useTables();
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState({});
  const [dismissed, setDismissed] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const enriched = tables.map((t) => ({
    ...t,
    issues: detectIssues(t),
    recs: generateRecommendations(t, detectIssues(t)),
  }));
  const withIssues = enriched.filter((t) => t.issues.length > 0);
  const filtered = withIssues.filter((t) => {
    const q = search.toLowerCase();
    if (
      q &&
      !t.name.toLowerCase().includes(q) &&
      !t.fullyQualifiedName?.toLowerCase().includes(q)
    )
      return false;
    if (filter === "High") return t.issues.some((i) => i.severity === "high");
    if (filter === "PII")
      return t.issues.some((i) => i.type === "untagged_pii");
    if (filter === "No Owner")
      return t.issues.some((i) => i.type === "missing_owner");
    if (filter === "No Description")
      return t.issues.some((i) => i.type === "missing_description");
    return true;
  });

  const selectedFresh = selected
    ? enriched.find((t) => t.id === selected.id)
    : null;

  async function applyRec(table, rec) {
    setApplying((p) => ({ ...p, [rec.id]: true }));
    try {
      if (rec.action === "assign_owner")
        await updateTableOwner(table.id, rec.metadata.owner);
      else if (rec.action === "add_description")
        await updateTableDescription(table.id, rec.metadata.description);
      else if (rec.action === "tag_pii")
        await addPIITags(
          table.id,
          rec.metadata.columns.map((c) => c.name),
        );
      await refresh();
    } catch (e) {
      //   showToast(e.message, 'error');
    } finally {
      setApplying((p) => ({ ...p, [rec.id]: false }));
    }
  }

  if (loading) return <Loader text="Loading" />;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StatsBar
        tables={tables}
        withIssues={withIssues}
        highCount={
          withIssues.filter((t) => t.issues.some((i) => i.severity === "high"))
            .length
        }
        piiCount={
          withIssues.filter((t) =>
            t.issues.some((i) => i.type === "untagged_pii"),
          ).length
        }
        noOwner={
          withIssues.filter((t) =>
            t.issues.some((i) => i.type === "missing_owner"),
          ).length
        }
        totalRecs={withIssues.reduce((s, t) => s + t.recs.length, 0)}
      />

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} md={8}>
          <TableList
            tables={tables}
            filtered={filtered}
            withIssues={withIssues}
            selected={selected}
            search={search}
            filter={filter}
            onSearch={setSearch}
            onFilter={setFilter}
            onSelect={setSelected}
            onRefresh={refresh}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {selectedFresh ? (
            <DetailPanel
              table={selectedFresh}
              applying={applying}
              dismissed={dismissed}
              onApply={applyRec}
              onDismiss={(id) => setDismissed((p) => ({ ...p, [id]: true }))}
              onClose={() => setSelected(null)}
            />
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={400}
              border="1px dashed"
              borderColor="divider"
              borderRadius={1}
              gap={1}
            >
              <Typography fontSize={24} sx={{ opacity: 0.2 }}>
                ▤
              </Typography>
              <Typography
                fontFamily="monospace"
                fontSize={12}
                color="text.secondary"
              >
                select a table to view recommendations
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
