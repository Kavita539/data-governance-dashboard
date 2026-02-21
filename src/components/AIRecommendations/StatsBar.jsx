import { Grid, Paper, Typography } from "@mui/material";

const StatCell = ({ label, value, color, sub }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      textAlign: "center",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h5" fontWeight={700} color={color}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {sub}
    </Typography>
  </Paper>
);

export default function StatsBar({
  tables,
  withIssues,
  highCount,
  piiCount,
  noOwner,
  totalRecs,
}) {
  const pct =
    tables.length > 0
      ? Math.round((withIssues.length / tables.length) * 100)
      : 0;
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="Total Tables"
          value={tables.length}
          color="primary.main"
          sub="in catalog"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="With Issues"
          value={withIssues.length}
          color="error.main"
          sub={`${pct}% of catalog`}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="High Severity"
          value={highCount}
          color="warning.main"
          sub="require urgent action"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="PII Risks"
          value={piiCount}
          color="secondary.main"
          sub="untagged columns"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="No Owner"
          value={noOwner}
          color="warning.main"
          sub="unowned tables"
        />
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <StatCell
          label="AI Actions"
          value={totalRecs}
          color="success.main"
          sub="ready to apply"
        />
      </Grid>
    </Grid>
  );
}
