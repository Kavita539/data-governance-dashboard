import { useState, useEffect } from "react";
import { Alert, Box, Grid } from "@mui/material";

import StatsBar from "../components/CostOptimizations/StatsBar";
import TiersPanel from "../components/CostOptimizations/TierPanels";
import RecsPanel from "../components/CostOptimizations/RecsPanel";
import Loader from "../components/Loader/Loader";

import { useTables } from "../context/TableContext";

import {
  calculateCost,
  categorizeTables,
  generateCostRecommendations,
  tierCost,
} from "../api/governance";
import { fmtCost } from "../helpers/helper";
import { TIER_ORDER } from "../constants/constants";


export default function CostOptimization() {
  const { tables, loading, error } = useTables();
  const [expanded, setExpanded] = useState({});
  const [taskDone, setTaskDone] = useState({});

  if (loading) return <Loader text="Loading cost data..." />;

  const tiers = categorizeTables(tables);
  const recs = generateCostRecommendations(tiers);
  const totalCost = TIER_ORDER.reduce((s, id) => s + tierCost(tiers[id]), 0);
  const totalSavings = recs.reduce((s, r) => s + r.savings, 0);
  const maxCost = Math.max(...TIER_ORDER.map((id) => tierCost(tiers[id])), 1);

  function handleToggle(tierId) {
    setExpanded((p) => ({ ...p, [tierId]: !p[tierId] }));
  }

  function handleCreateTask(rec) {
    setTaskDone((p) => ({ ...p, [rec.id]: true }));
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StatsBar
        tables={tables}
        totalCost={totalCost}
        totalSavings={totalSavings}
        dormantCount={tiers.T5.tables.length}
        criticalCount={tiers.T1.tables.length}
        recsCount={recs.length}
        fmtCost={fmtCost}
      />

      <Grid
        container
        spacing={2}
        sx={{
          display: { md: "grid" },
          gridTemplateColumns: { md: "1fr 600px" },
          gap: "16px",
          alignItems: "start",
          width: "100%",
        }}
      >
        <Grid item xs={12} md={8}>
          <TiersPanel
            tiers={tiers}
            expanded={expanded}
            onToggle={handleToggle}
            tierCost={tierCost}
            calculateCost={calculateCost}
            maxCost={maxCost}
            fmtCost={fmtCost}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            maxWidth: { md: "100%" },
            flexBasis: { md: "auto" },
          }}
        >
          <RecsPanel
            recs={recs}
            taskDone={taskDone}
            onCreateTask={handleCreateTask}
            fmtCost={fmtCost}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
