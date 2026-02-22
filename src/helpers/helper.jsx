import { Box, Skeleton, TableCell, TableRow } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";

export const renderSkeletons = () => {
  return Array.from(new Array(10)).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <Skeleton variant="circular" width={8} height={8} animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="60%" animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton
          variant="text"
          width="90%"
          animation="wave"
          sx={{ fontSize: "10px" }}
        />
      </TableCell>
      <TableCell>
        <Box display="flex" gap={0.5}>
          <Skeleton variant="rounded" width={40} height={20} animation="wave" />
        </Box>
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={50} animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={30} animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton variant="rounded" width={60} height={24} animation="wave" />
      </TableCell>
    </TableRow>
  ));
};

export const severityColor = (issues) =>
  issues.some((i) => i.severity === "high") ? "error.main" : "warning.main";

export const confidenceColor = (c) =>
  ({ High: "success", Medium: "warning", Low: "default" })[c] || "default";

export const actionIcon = (action) =>
  ({
    tag_pii: <ShieldIcon fontSize="small" />,
    assign_owner: <PersonIcon fontSize="small" />,
    add_description: <DescriptionIcon fontSize="small" />,
  })[action];

export const impactColor = (impact) =>
  ({ High: "error.main", Medium: "warning.main", Low: "info.main" })[impact] ||
  "text.primary";

export const detailPanel =(table) => ( [
  { label: "Columns", value: table.columns?.length ?? "—" },
  {
    label: "Owner",
    value: table.owners?.[0]?.name || "None",
    color: table.owners!== null || table.owners?.length > 0 ? "text.primary" : "error.main",
  },
  {
    label: "Daily Queries",
    value: table.usageSummary?.dailyStats?.count ?? "—",
  },
  { label: "Issues", value: table.issues.length, color: "error.main" },
]);

export const fmtCost = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`);

export const costRecs =(rec) =>( [
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
]);
