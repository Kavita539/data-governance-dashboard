import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import RecCard from "./RecCard";
import ColumnsList from "./ColumnsList";

export default function DetailPanel({
  table,
  applying,
  dismissed,
  onApply,
  onDismiss,
  onClose,
}) {
  const activeRecs = table.recs.filter((r) => !dismissed[r.id]);

  return (
    <Paper variant="outlined" sx={{ position: "sticky", top: 64 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        p={1.5}
        bgcolor="action.hover"
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Box>
          <Typography fontFamily="monospace" fontWeight={600} fontSize={14}>
            {table.name}
          </Typography>
          <Typography
            fontFamily="monospace"
            fontSize={10}
            color="text.secondary"
            sx={{ wordBreak: "break-all" }}
          >
            {table.fullyQualifiedName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Meta */}
      <Box
        display="flex"
        gap={2}
        p={1.5}
        borderBottom="1px solid"
        borderColor="divider"
      >
        {[
          { label: "Columns", value: table.columns?.length ?? "—" },
          {
            label: "Owner",
            value: table.owner?.name || "None",
            color: table.owner ? "text.primary" : "error.main",
          },
          {
            label: "Daily Queries",
            value: table.usageSummary?.dailyStats?.count ?? "—",
          },
          { label: "Issues", value: table.issues.length, color: "error.main" },
        ].map(({ label, value, color }) => (
          <Box key={label}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textTransform="uppercase"
              letterSpacing={0.6}
              fontSize={9}
            >
              {label}
            </Typography>
            <Typography
              fontFamily="monospace"
              fontSize={12}
              color={color || "text.secondary"}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Recs */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={1.5}
        py={1}
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Typography fontWeight={600} fontSize={13}>
          AI Recommendations
        </Typography>
        <Chip
          label={`${activeRecs.length} pending`}
          size="small"
          variant="outlined"
        />
      </Box>

      <Box p={1.5}>
        {activeRecs.length === 0 ? (
          <Typography
            color="success.main"
            fontFamily="monospace"
            fontSize={12}
            textAlign="center"
            py={3}
          >
            All recommendations applied
          </Typography>
        ) : (
          activeRecs.map((rec) => (
            <RecCard
              key={rec.id}
              rec={rec}
              applying={applying[rec.id]}
              onApply={() => onApply(table, rec)}
              onDismiss={() => onDismiss(rec.id)}
            />
          ))
        )}
      </Box>

      <Divider />
      <ColumnsList columns={table.columns} />
    </Paper>
  );
}
