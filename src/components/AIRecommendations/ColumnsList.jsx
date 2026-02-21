import { Box, Chip, Divider, Typography } from "@mui/material";

export default function ColumnsList({ columns }) {
  if (!columns?.length) return null;
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          px: 2,
          py: 1,
          display: "block",
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        Columns ({columns.length})
      </Typography>
      <Divider />
      {columns.map((col, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          gap={1}
          px={2}
          py={0.75}
          borderBottom="1px solid"
          borderColor="divider"
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          <Typography fontFamily="monospace" fontSize={12} flex={1}>
            {col.name}
          </Typography>
          <Typography
            fontFamily="monospace"
            fontSize={11}
            color="text.secondary"
            width={80}
          >
            {col.dataType}
          </Typography>
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {col.tags?.map((t, j) => (
              <Chip
                key={j}
                label={t.tagFQN}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ maxWidth: "100px" }}
              />
            ))}
            {/email|phone|ssn|address|ip_address/i.test(col.name) &&
              !col.tags?.some((t) => t.tagFQN?.startsWith("PII")) && (
                <Chip
                  label="⚠ PII?"
                  size="small"
                  color="error"
                  sx={{ maxWidth: "100px" }}
                />
              )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
