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
        px: { xs: 1, sm: 1.5 },
        minWidth: { xs: 0, sm: "auto" },
        color: active ? "text.primary" : "text.secondary",
        bgcolor: active ? "action.selected" : "transparent",
        border: active ? "1px solid" : "1px solid transparent",
        borderColor: active ? "divider" : "transparent",
        "&:hover": { bgcolor: "action.hover", color: "text.primary" },
        gap: 0.75,
        "& .MuiButton-startIcon": { mr: { xs: 0, sm: 0.75 } },
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
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        {label}
      </Box>
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
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#e2e4e9",
          borderBottom: "1px solid",
          borderColor: "divider",
          width: "100%",
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            gap: { xs: 1, sm: 3 },
            minHeight: 44,
            px: { xs: 1, sm: 2.5 },
          }}
        >
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
                display: { xs: "none", md: "block" }, // Hide name on small mobile
                color: "#000",
              }}
            >
              DataSteward
            </Typography>
          </Box>

          {/* Nav */}
          <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
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
                fontSize: 10,
                color: "#000",
                display: { xs: "none", lg: "block" }, // Only show full URL on large screens
              }}
            >
              sandbox.open-metadata.org
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: "100%",
          p: { xs: 1.5, sm: 2.5 },
          boxSizing: "border-box",
        }}
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
