import { Box, Button, Chip, Paper, Typography } from "@mui/material";

const impactColor = (impact) =>
  ({ High: "error.main", Medium: "warning.main", Low: "info.main" })[impact] ||
  "text.primary";

export default function CostRecCard({ rec, isDone, onCreateTask, fmtCost }) {
  return (
    <Box
      px={2}
      py={1.75}
      borderBottom="1px solid"
      borderColor="divider"
      sx={{
        "&:hover": { bgcolor: "action.hover" },
        "&:last-child": { borderBottom: "none" },
      }}
    >
      {/* Top */}
      <Box display="flex" gap={1.5} mb={1.25}>
        <Typography fontSize={18}>{rec.icon}</Typography>
        <Box flex={1}>
          <Typography fontSize={13} fontWeight={600} mb={0.5}>
            {rec.title}
          </Typography>
          <Typography fontSize={11.5} color="text.secondary" lineHeight={1.5}>
            {rec.description}
          </Typography>
        </Box>
      </Box>

      {/* Metrics */}
      <Paper
        variant="outlined"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          mb: 1.25,
          overflow: "hidden",
          borderRadius: 1,
        }}
      >
        {[
          {
            label: "Savings",
            value: `${fmtCost(rec.savings)}/mo`,
            color: "success.main",
          },
          {
            label: "Impact",
            value: rec.impact,
            color: impactColor(rec.impact),
          },
          {
            label: "Confidence",
            value: rec.confidence,
            color: rec.confidence === "High" ? "success.main" : "warning.main",
          },
        ].map(({ label, value, color }, i) => (
          <Box
            key={label}
            px={1.25}
            py={1}
            borderRight={i < 2 ? "1px solid" : "none"}
            borderColor="divider"
          >
            <Typography
              fontFamily="monospace"
              fontSize={9}
              textTransform="uppercase"
              letterSpacing={0.6}
              color="text.secondary"
              mb={0.5}
            >
              {label}
            </Typography>
            <Typography
              fontFamily="monospace"
              fontSize={13}
              fontWeight={600}
              color={color}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* Affected Tables */}
      {rec.tables.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1.25}>
          {rec.tables.slice(0, 4).map((t) => (
            <Chip
              key={t.id}
              label={t.name}
              size="small"
              variant="outlined"
              sx={{ fontFamily: "monospace", fontSize: 10.5 }}
            />
          ))}
          {rec.tables.length > 4 && (
            <Chip
              label={`+${rec.tables.length - 4} more`}
              size="small"
              sx={{ fontSize: 10.5 }}
            />
          )}
        </Box>
      )}

      {/* Footer */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          size="small"
          variant={isDone ? "outlined" : "contained"}
          color={isDone ? "success" : "primary"}
          disabled={isDone}
          onClick={onCreateTask}
        >
          {isDone ? "Task Created" : "+ Create Task"}
        </Button>
      </Box>
    </Box>
  );
}
