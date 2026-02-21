import { Grid } from "@mui/material";

import StatCell from "./StatCell";

export default function StatsBar({
  tables,
  totalCost,
  totalSavings,
  dormantCount,
  criticalCount,
  recsCount,
  fmtCost,
}) {
  const savingsPct =
    totalCost > 0 ? Math.round((totalSavings / totalCost) * 100) : 0;
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="Total Tables"
          value={tables.length}
          color="primary.main"
          sub="across all tiers"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="Monthly Cost"
          value={fmtCost(totalCost)}
          color="error.main"
          sub="simulated estimate"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="Potential Savings"
          value={fmtCost(totalSavings)}
          color="success.main"
          sub={`${savingsPct}% reducible`}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="T5 Dormant"
          value={dormantCount}
          color="secondary.main"
          sub="archive candidates"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="T1 Critical"
          value={criticalCount}
          color="warning.main"
          sub="mission-critical"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="AI Actions"
          value={recsCount}
          color="info.main"
          sub="recommended"
        />
      </Grid>
    </Grid>
  );
}
