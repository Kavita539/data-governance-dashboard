import { useState, useEffect } from "react";
import { Alert, Box, Grid } from "@mui/material";

import StatsBar from "../components/CostOptimizations/StatsBar";
import TiersPanel from "../components/CostOptimizations/TierPanels";
import RecsPanel from "../components/CostOptimizations/RecsPanel";
import Loader from "../components/Loader/Loader";

import { getTables } from "../api";
import {
  calculateCost,
  categorizeTables,
  generateCostRecommendations,
  tierCost,
} from "../api/governance";

const TIER_ORDER = ["T1", "T2", "T3", "T4", "T5"];

const fmtCost = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`);

export default function CostOptimization() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [taskDone, setTaskDone] = useState({});

  useEffect(() => {
    getTables()
      .then(setTables)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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

      <Grid container spacing={2} alignItems="flex-start">
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
        <Grid item xs={12} md={4}>
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
