import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: "2px",
    padding: theme.spacing(0, 2),
  },
}));

const Header: React.FC<{ setShowForm: (showForm: boolean) => void }> = ({
  setShowForm,
}) => {
  const classes = useStyles();
  return (
    <Grid className={classes.container} item container alignItems="center">
      <Grid item xs={4}></Grid>
      <Grid item xs={4} container justify="center">
        <Button onClick={() => setShowForm(false)} size="large" color="inherit">
          Robe
        </Button>
      </Grid>
      <Grid item xs={4} container justify="flex-end">
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => setShowForm(true)}
        >
          <AddIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Header;
