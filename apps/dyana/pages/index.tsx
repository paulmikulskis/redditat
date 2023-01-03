import styles from "../styles/Home.module.css";
import Switch from "@mui/material/Switch";
import { FileGridTable } from "../components/FileGridTable";
import { FileGrid } from "../components/FileGrid";
import React, { useState, useEffect } from "react";
import { Grid, Chip, IconButton } from "@material-ui/core";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { theme as defaultTheme } from "../utils/theme";
import { Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  appContentBox: {
    width: "90%",
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={styles.container}>
      <Stack
        direction="column"
        spacing={3}
        style={{ width: "90%" }}
        justifyContent="flex-start"
      >
        <Typography variant="h5">Recent Files Browser</Typography>
        <FileGrid />
      </Stack>
    </div>
  );
}
