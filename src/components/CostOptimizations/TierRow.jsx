import {
  Box,
  Collapse,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const TIER_LABELS = { T1: "🔴", T2: "🟡", T3: "🔵", T4: "🟣", T5: "⚫" };

export default function TierRow({
  tierId,
  tier,
  cost,
  barPct,
  isOpen,
  onToggle,
  fmtCost,
}) {
  return (
    <Box borderBottom="1px solid" borderColor="divider">
      {/* Header Row */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.25}
        onClick={onToggle}
        sx={{
          cursor: "pointer",
          bgcolor: isOpen ? "rgba(56,139,253,0.06)" : "action.hover",
          "&:hover": { bgcolor: "action.selected" },
          transition: "background 0.1s",
        }}
      >
        {/* Left */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 600,
              px: 1,
              py: 0.25,
              borderRadius: 0.5,
              border: "1px solid",
              borderColor: tier.color + "44",
              color: tier.color,
              bgcolor: tier.color + "11",
              minWidth: 28,
              textAlign: "center",
            }}
          >
            {tierId}
          </Box>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontSize={13} fontWeight={500}>
                {TIER_LABELS[tierId]} {tier.name}
              </Typography>
              <Typography
                fontFamily="monospace"
                fontSize={11}
                color="text.secondary"
              >
                {tier.tables.length} table{tier.tables.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box width={80}>
            <LinearProgress
              variant="determinate"
              value={barPct}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: "action.disabledBackground",
                "& .MuiLinearProgress-bar": { bgcolor: tier.color },
              }}
            />
          </Box>
          <Typography
            fontFamily="monospace"
            fontSize={14}
            fontWeight={600}
            color={tier.color}
          >
            {fmtCost(cost)}
            <Typography
              component="span"
              fontSize={10}
              color="text.secondary"
              fontWeight={400}
            >
              /mo
            </Typography>
          </Typography>
          {isOpen ? (
            <ExpandMoreIcon fontSize="small" sx={{ color: "text.secondary" }} />
          ) : (
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: "text.secondary" }}
            />
          )}
        </Box>
      </Box>

      {/* Expandable Table */}
      <Collapse in={isOpen}>
        <Box bgcolor="background.paper">
          {tier.tables.length === 0 ? (
            <Typography
              fontFamily="monospace"
              fontSize={11}
              color="text.secondary"
              textAlign="center"
              py={2}
            >
              No tables in this tier
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  {[
                    "Table",
                    "Queries/day",
                    "Percentile",
                    "Owner",
                    "Est. Monthly",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tier.tables.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>
                      <Typography fontFamily="monospace" fontSize={12}>
                        {t.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontFamily="monospace">
                        {t.usageSummary?.dailyStats?.count ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontFamily="monospace" color="text.secondary">
                        {(
                          t.usageSummary?.dailyStats?.percentileRank ?? 0
                        ).toFixed(1)}
                        %
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontSize={11.5}
                        color={t.owner ? "text.secondary" : "error.main"}
                      >
                        {t.owner?.name || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontFamily="monospace" color={tier.color}>
                        {fmtCost(t._cost)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
