import { Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: "2px",
    marginBottom: theme.spacing(3),
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid className={classes.container} item xs={12}>
      <Typography color="inherit" align="center" variant="h6">
        {" "}
        Robe
      </Typography>
    </Grid>
  );
};

export default Header;
