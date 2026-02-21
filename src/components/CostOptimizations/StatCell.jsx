import { Paper, Typography } from "@mui/material";

export default function StatCell({ label, value, color, sub }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        textAlign: "center",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
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
}
