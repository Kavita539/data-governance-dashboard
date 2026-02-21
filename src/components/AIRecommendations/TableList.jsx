import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const FILTERS = ["All", "High", "PII", "No Owner", "No Description"];

const severityColor = (issues) =>
  issues.some((i) => i.severity === "high") ? "error.main" : "warning.main";

export default function TableList({
  tables,
  filtered,
  withIssues,
  selected,
  search,
  filter,
  onSearch,
  onFilter,
  onSelect,
  onRefresh,
}) {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search tables..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={filter}
          onChange={(_, v) => v && onFilter(v)}
        >
          {FILTERS.map((f) => (
            <ToggleButton key={f} value={f} sx={{ fontSize: 11, px: 1.5 }}>
              {f}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer
        component={Box}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "action.hover" }}>
              {[
                "",
                "Table Name",
                "Database",
                "Issues",
                "Owner",
                "Queries/day",
                "Actions",
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
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{
                    py: 4,
                    color: "text.secondary",
                    fontFamily: "monospace",
                    fontSize: 12,
                  }}
                >
                  {withIssues.length === 0
                    ? "No issues detected"
                    : "No tables match filter"}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((table) => (
              <TableRow
                key={table.id}
                hover
                selected={selected?.id === table.id}
                onClick={() => onSelect(table)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: severityColor(table.issues),
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontFamily="monospace" fontSize={12.5}>
                    {table.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontFamily="monospace"
                    fontSize={11}
                    color="text.secondary"
                  >
                    {table.fullyQualifiedName
                      ?.split(".")
                      .slice(0, -1)
                      .join(".")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {table.issues.map((iss, i) => (
                      <Chip
                        key={i}
                        size="small"
                        label={
                          iss.type === "untagged_pii"
                            ? "PII"
                            : iss.type === "missing_owner"
                              ? "no owner"
                              : "no desc"
                        }
                        color={iss.severity === "high" ? "error" : "warning"}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    fontSize={11.5}
                    color={table.owner ? "text.secondary" : "error.main"}
                  >
                    {table.owner?.name || "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontFamily="monospace" fontSize={12}>
                    {table.usageSummary?.dailyStats?.count ?? "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={`${table.recs.length} fixes`}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="monospace"
        mt={1}
        display="block"
      >
        Showing {filtered.length} of {withIssues.length} tables with issues
      </Typography>
    </Box>
  );
}
