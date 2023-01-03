import styles from "../styles/Home.module.css";
import Switch from "@mui/material/Switch";
import { FileGridTable } from "./FileGridTable";
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
import { FileGridViewport } from "./FileGridViewport";
import { MEDIA_FILES_TYPES_SUPPORTED } from "../utils/constants";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    alignItems: "center",
    minHeight: "400px",
    maxHeight: "300px",
  },
  box: {
    width: "100%",
  },
}));

export interface File {
  path: string;
  preview: any;
  tags: string[];
  date: number;
}

export const FileGrid: React.FC = () => {
  const folder = "dyana/postem";
  const classes = useStyles();
  const [batch, setBatch] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const selectSetters = [selected, setSelected];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.post("/api/fetchFolder", {
          rawPath: folder,
          options: {
            thumbNails: false,
            limit: 20,
            from: 20 * batch,
            fileTypes: MEDIA_FILES_TYPES_SUPPORTED,
          },
        });
        setFiles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
  }, [batch, folder]);

  return (
    <Box className={classes.box}>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} md={8} className={classes.gridItem}>
          <FileGridTable
            folder="dyana/postem"
            files={files}
            setFiles={setFiles}
            selected={selected}
            setSelected={setSelected}
          />
        </Grid>
        <Grid item xs={12} md={4} className={classes.gridItem}>
          <FileGridViewport
            folder="dyana/postem"
            files={files}
            setFiles={setFiles}
            selected={selected}
            setSelected={setSelected}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
