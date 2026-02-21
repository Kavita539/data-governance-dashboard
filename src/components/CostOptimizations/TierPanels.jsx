import { Paper, Typography, Box } from "@mui/material";

import TierRow from "./TierRow";
import { TIER_ORDER } from "../../constants/constants";

export default function TiersPanel({
  tiers,
  expanded,
  onToggle,
  tierCost,
  maxCost,
  fmtCost,
}) {
  return (
    <Paper variant="outlined">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Typography fontWeight={600} fontSize={13}>
          Usage Tier Breakdown
        </Typography>
        <Typography fontFamily="monospace" fontSize={11} color="text.secondary">
          click tier to expand
        </Typography>
      </Box>

      {TIER_ORDER.map((tierId) => {
        const tier = tiers[tierId];
        const cost = tierCost(tier);
        const barPct = Math.round((cost / maxCost) * 100);
        return (
          <TierRow
            key={tierId}
            tierId={tierId}
            tier={tier}
            cost={cost}
            barPct={barPct}
            isOpen={!!expanded[tierId]}
            onToggle={() => onToggle(tierId)}
            fmtCost={fmtCost}
          />
        );
      })}
    </Paper>
  );
}
