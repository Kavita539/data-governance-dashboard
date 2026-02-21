import { Box, Chip, Paper, Typography } from "@mui/material";

import CostRecCard from "./CostRecCard";

export default function RecsPanel({ recs, taskDone, onCreateTask, fmtCost }) {
  return (
    <Paper variant="outlined" sx={{ position: "sticky", top: 64 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Typography fontWeight={600} fontSize={13}>
          AI Cost Recommendations
        </Typography>
        <Chip
          label={`${recs.length} actions`}
          size="small"
          variant="outlined"
        />
      </Box>

      {recs.map((rec) => (
        <CostRecCard
          key={rec.id}
          rec={rec}
          isDone={!!taskDone[rec.id]}
          onCreateTask={() => onCreateTask(rec)}
          fmtCost={fmtCost}
        />
      ))}
    </Paper>
  );
}
