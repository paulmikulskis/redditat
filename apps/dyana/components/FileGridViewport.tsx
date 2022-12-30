import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { FileGridTable } from "./FileGridTable";
import React, { useState, useEffect } from "react";
import { Grid, Chip } from "@material-ui/core";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { theme as defaultTheme } from "../utils/theme";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Collapse from "@mui/material/Collapse";
import { File } from "./FileGrid";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    alignItems: "center",
    minHeight: "400px",
    maxHeight: "800px",
  },
  box: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

interface Props {
  folder: string;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const FileGridViewport: React.FC<Props> = ({
  folder,
  files,
  setFiles,
  selected,
  setSelected,
}) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  if (selected.length === 0) {
    return <Box></Box>;
  }
  const selectedFileName = selected[selected.length - 1];
  const selectedFile = files[files.findIndex((s) => s.path === selectedFileName)];

  return (
    <Box className={classes.box}>
      <Card sx={{ maxWidth: 400 }}>
        <CardHeader
          title={selectedFile.path}
          subheader={"added: " + new Date(selectedFile.date).toDateString()}
        />
        <CardMedia
          component="img"
          height="256px"
          width="256px"
          src={`data:image/*;base64,${
            selectedFile.preview
              ? Buffer.from(selectedFile.preview, "binary")?.toString("base64")
              : undefined
          }`}
          alt="image preview"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            photo controls and posting controls here:
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
        </CardActions>
        {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside
            for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large
            plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay
            leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often
            until thickened and fragrant, about 10 minutes. Add saffron broth and
            remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and peppers,
            and cook without stirring, until most of the liquid is absorbed, 15 to 18
            minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking
            them down into the rice, and cook again without stirring, until mussels have
            opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that
            don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse> */}
      </Card>
    </Box>
  );
};
