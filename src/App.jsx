import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import { AppBar, Toolbar, Box, Button, Typography, Chip } from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AIRecommendations from "./pages/AIRecommendations";
import CostOptimization from "./pages/CostOptimization";
import { TableProvider } from "./context/TableContext";

function NavItem({ to, icon, label, count }) {
  const location = useLocation();
  const active =
    location.pathname === to ||
    (to === "/recommendations" && location.pathname === "/");

  return (
    <Button
      component={NavLink}
      to={to}
      startIcon={icon}
      variant={active ? "contained" : "text"}
      size="small"
      sx={{
        textTransform: "none",
        fontSize: 12.5,
        fontWeight: 500,
        px: 1.5,
        color: active ? "text.primary" : "text.secondary",
        bgcolor: active ? "action.selected" : "transparent",
        border: active ? "1px solid" : "1px solid transparent",
        borderColor: active ? "divider" : "transparent",
        "&:hover": { bgcolor: "action.hover", color: "text.primary" },
        gap: 0.75,
      }}
      endIcon={
        count != null ? (
          <Chip
            label={count}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              fontFamily: "monospace",
              bgcolor: active ? "primary.main" : "action.selected",
              color: active ? "#fff" : "text.secondary",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        ) : undefined
      }
    >
      {label}
    </Button>
  );
}

function Layout({ issueCount }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f4f5f7",
        color: "text.primary",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#e2e4e9",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar variant="dense" sx={{ gap: 3, minHeight: 44, px: 2.5 }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: "#000", fontSize: 14 }}>▣</Typography>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: 0.5,
                color: "#000",
              }}
            >
              DataSteward
            </Typography>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: 10,
                color: "text.disabled",
                ml: 0.25,
                color: "#000",
              }}
            >
              v1.0
            </Typography>
          </Box>

          {/* Nav */}
          <Box sx={{ display: "flex", gap: 0.25, flex: 1 }}>
            <NavItem
              to="/recommendations"
              icon={<FlashOnIcon sx={{ fontSize: 14 }} />}
              label="AI Recommendations"
              count={issueCount}
            />
            <NavItem
              to="/cost"
              icon={<AttachMoneyIcon sx={{ fontSize: 14 }} />}
              label="Cost Optimization"
            />
          </Box>

          {/* Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              ml: "auto",
            }}
          >
            <FiberManualRecordIcon
              sx={{
                fontSize: 8,
                color: "#3fb950",
                animation: "blink 2s infinite",
                "@keyframes blink": {
                  "0%,100%": { opacity: 1 },
                  "50%": { opacity: 0.4 },
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "text.disabled",
              }}
            >
              sandbox.open-metadata.org
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{ flex: 1, maxWidth: 1440, mx: "auto", width: "100%", p: 2.5 }}
      >
        <Routes>
          <Route path="/" element={<AIRecommendations />} />
          <Route path="/recommendations" element={<AIRecommendations />} />
          <Route path="/cost" element={<CostOptimization />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  const [issueCount, setIssueCount] = useState(null);

  return (
    <BrowserRouter>
      <TableProvider onIssueCount={setIssueCount}>
        <Layout issueCount={issueCount} />
      </TableProvider>
    </BrowserRouter>
  );
}
