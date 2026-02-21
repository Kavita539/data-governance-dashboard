import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import { actionIcon, confidenceColor } from "../../helpers/helper";



export default function RecCard({ rec, applying, onApply, onDismiss }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {actionIcon(rec.action)}
          <Typography fontWeight={600} fontSize={13}>
            {rec.title}
          </Typography>
        </Box>
        <Chip
          label={rec.confidence}
          color={confidenceColor(rec.confidence)}
          size="small"
        />
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          mb: 1,
          bgcolor: "action.hover",
          borderLeft: "3px solid",
          borderColor: "primary.main",
        }}
      >
        <Typography fontFamily="monospace" fontSize={11.5}>
          {rec.suggestion}
        </Typography>
      </Paper>

      <Typography fontSize={11} color="text.secondary" mb={1.5}>
        {rec.detail}
      </Typography>

      <Box display="flex" gap={1}>
        <Button
          size="small"
          variant="contained"
          disabled={applying}
          startIcon={applying ? <CircularProgress size={12} /> : null}
          onClick={onApply}
        >
          {applying ? "Applying..." : "Apply"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </Box>
    </Paper>
  );
}
