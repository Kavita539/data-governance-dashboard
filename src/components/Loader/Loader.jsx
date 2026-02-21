import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loader({ text }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      justifyContent="center"
      py={8}
    >
      <CircularProgress size={20} />
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
}
