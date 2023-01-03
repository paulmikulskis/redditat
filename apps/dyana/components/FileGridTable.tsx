/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Grid, Chip, IconButton } from "@material-ui/core";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { theme as defaultTheme } from "../utils/theme";
import Checkbox from "@mui/material/Checkbox";
import { File } from "./FileGrid";
import { Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "spa",
    "&:hover": {
      backgroundColor: defaultTheme.palette.divider,
    },
  },
  image: {},
  filePath: {
    flexGrow: 1,
  },
  tags: {
    padding: "1rem",
    display: "flex",
  },
  menu: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
}));

interface Props {
  folder: string;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.text.secondary,
  backgroundColor: "transparent",
}));

export const FileGridTable: React.FC<Props> = ({
  folder,
  files,
  setFiles,
  selected,
  setSelected,
}) => {
  const [hoverRows, setHoverRows] = useState<string>("");
  const [batch, setBatch] = useState(1);
  const classes = useStyles();
  const PIC_ROW_HEIGHT = "64px";

  const handleSelection = (path: string) => {
    if (selected.includes(path)) {
      setSelected(selected.filter((p) => p !== path));
    } else {
      setSelected([...selected, path]);
    }
  };

  const handleScroll = (event: any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      setBatch(batch + 1);
    }
  };

  const generateMediaPreviewGridItem = (file: File) => {
    return (
      // media preview grid item
      <Grid key={file.path} item xs="auto" className={classes.image}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
        >
          <Item>
            <img
              style={{ width: PIC_ROW_HEIGHT, height: PIC_ROW_HEIGHT }}
              src={`data:image/*;base64,${
                file.preview
                  ? Buffer.from(file.preview, "binary")?.toString("base64")
                  : undefined
              }`}
              alt={file.path.slice(file.path.lastIndexOf("/") + 1)}
            />
          </Item>
        </Stack>
      </Grid>
    );
  };

  const generatefileInfoGridItem = (file: File) => {
    return (
      <Grid key={file.path} item xs={3} className={classes.filePath}>
        <Item style={{ width: "100%" }}>
          <Typography>{file.path}</Typography>
        </Item>
      </Grid>
    );
  };

  const generateTagsGridItem = (file: File) => {
    return (
      <Grid item xs={3} className={classes.tags}>
        <Item>
          <Stack direction="row" divider={<p>.</p>} spacing={1}>
            {file.tags.map((tag) => (
              <Chip key={tag} label={tag} color="primary" />
            ))}
          </Stack>
        </Item>
      </Grid>
    );
  };

  const generateMoreOptionsGridItem = (file: File) => {
    return (
      <Grid item xs={1} className={classes.menu}>
        <Item>
          <IconButton aria-label="more options">
            <MoreHorizIcon color={"action"} />
          </IconButton>
        </Item>
      </Grid>
    );
  };

  const generateSelectionGridItem = (file: File) => {
    return (
      <Grid item xs={1} className={classes.menu}>
        <Item>
          <Checkbox
            color="secondary"
            //@ts-ignore
            size="large"
            onClick={() => handleSelection(file.path)}
          />
        </Item>
      </Grid>
    );
  };

  const mouseOver = (file: File) => {
    setHoverRows(file.path);
  };

  const mouseOut = (file: File) => {
    setHoverRows("");
  };

  const generateGridRow = (file: File) => {
    return (
      <div>
        <Divider />
        <Grid
          onMouseOver={() => mouseOver(file)}
          onMouseOut={() => mouseOut(file)}
          className={classes.root}
          container
          justifyContent="space-between"
          direction="row"
          style={{
            padding: "0.25rem 1rem 0.25rem 1rem",
            backgroundColor:
              selected.includes(file.path) || hoverRows === file.path
                ? defaultTheme.palette.divider
                : defaultTheme.palette.background.default,
          }}
        >
          {generateSelectionGridItem(file)}
          {generateMediaPreviewGridItem(file)}
          {generatefileInfoGridItem(file)}
          {generateTagsGridItem(file)}
          {generateMoreOptionsGridItem(file)}
        </Grid>
      </div>
    );
  };

  return (
    <Box
      border={2}
      borderLeft={0}
      borderRight={0}
      borderColor="black"
      sx={{
        width: "100%",
        overflow: "hidden",
        overflowY: "scroll",
        maxHeight: "100%",
      }}
    >
      <Grid container direction="column" onScroll={handleScroll}>
        {files.map((file) => generateGridRow(file))}
      </Grid>
      {files.length > 0 ? <Divider /> : <></>}
    </Box>
  );
};

export default FileGridTable;
