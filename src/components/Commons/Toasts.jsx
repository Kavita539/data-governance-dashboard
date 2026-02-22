import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export function Toasts({ toasts }) {
  if (!toasts.length) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      {toasts.map((t) => (
        <Box
          key={t.id}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderLeft: "3px solid",
            borderLeftColor: t.type === "success" ? "success.main" : "error.main",
            borderRadius: 1,
            px: 1.75,
            py: 1.25,
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            animation: "slideIn 0.15s ease",
            "@keyframes slideIn": {
              from: { transform: "translateX(12px)", opacity: 0 },
              to: { transform: "none", opacity: 1 },
            },
          }}
        >
          {t.type === "success" ? (
            <CheckIcon sx={{ fontSize: 14, color: "success.main" }} />
          ) : (
            <CloseIcon sx={{ fontSize: 14, color: "error.main" }} />
          )}
          <Typography fontFamily="monospace" fontSize={12}>
            {t.message}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}