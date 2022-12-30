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
  root: {
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: defaultTheme.palette.primary.dark,
    },
  },
  image: {
    width: "50px",
    height: "50px",
  },
  filePath: {
    flexGrow: 1,
  },
  tags: {
    display: "flex",
  },
  menu: {
    display: "flex",
    alignItems: "center",
  },
}));

interface File {
  path: string;
  previews: Buffer;
  tags: string[];
  date: number;
}

interface Props {
  folder: string;
}

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: "transparent",
}));

export const FileGrid: React.FC<Props> = ({ folder }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [batch, setBatch] = useState(1);
  const classes = useStyles();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.post("/api/fetchFolder", {
          rawPath: folder,
          options: {
            thumbNails: false,
            limit: 20,
            from: 20 * batch,
          },
        });
        setFiles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
  }, [batch, folder]);

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

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container direction="column" onScroll={handleScroll}>
        {files.map((file) => (
          <Grid
            key={file.path}
            item
            xs={6}
            className={classes.root}
            onClick={() => handleSelection(file.path)}
          >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
            >
              {/* <img src={file.previews} alt={file.path} className={classes.image} /> */}
              <Item
                className={classes.filePath}
                sx={{ height: "100%", justifyContent: "space-around" }}
              >
                <p>{file.path}</p>
              </Item>
              <Item className={classes.tags}>
                {file.tags.map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </Item>
              <Item className={classes.menu}>
                <IconButton aria-label="more options">
                  {/* Add a Material-UI icon for the menu here */}
                  <MoreHorizIcon />
                </IconButton>
              </Item>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FileGrid;
