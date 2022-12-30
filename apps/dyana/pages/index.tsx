import styles from "../styles/Home.module.css";
import Switch from "@mui/material/Switch";
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

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    alignItems: "center",
    minHeight: "400px",
    maxHeight: "800px",
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={styles.container}>
      <div>
        <span>With default Theme:</span>
      </div>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} md={8} className={classes.gridItem}>
          <FileGrid folder="dyana/postem" />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          className={classes.gridItem}
          style={{
            color: defaultTheme.palette.primary.light,
          }}
        >
          <Paper
            style={{
              color: defaultTheme.palette.primary.light,
              width: "100%",
              height: "100%",
            }}
          ></Paper>
        </Grid>
      </Grid>
    </div>
  );
}
