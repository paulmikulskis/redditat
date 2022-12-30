import React, { useState, useEffect } from "react";
import { Grid, Chip, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#eee",
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const FileGrid: React.FC<Props> = ({ folder }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [batch, setBatch] = useState(1);
  const classes = useStyles();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.post("/files/list", {
          folder,
          options: {
            thumbNails: true,
            limit: 20,
            from: 20 * batch,
          },
        });
        setFiles(response.data.files);
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
    <Box>
      <Grid container direction="column" onScroll={handleScroll}>
        {files.map((file) => (
          <Grid
            key={file.path}
            item
            xs={12}
            className={classes.root}
            onClick={() => handleSelection(file.path)}
          >
            <div>
              {/* <img src={file.previews} alt={file.path} className={classes.image} /> */}
              <div className={classes.filePath}>{file.path}</div>
              <div className={classes.tags}>
                {file.tags.map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </div>
              <div className={classes.menu}>
                <IconButton aria-label="more options">
                  {/* Add a Material-UI icon for the menu here */}
                </IconButton>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FileGrid;
