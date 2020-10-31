import {
  Box,
  Button,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: "2px",
  },
}));

const Header: React.FC<{ setShowForm: (showForm: boolean) => void }> = ({
  setShowForm,
}) => {
  const classes = useStyles();
  return (
    <>
      <Grid className={classes.container} item xs={12}>
        <Typography color="inherit" align="center" variant="h6">
          {" "}
          Robe
        </Typography>
      </Grid>
      <Box p={3}>
        <Grid container justify="flex-end" alignItems="center" spacing={2}>
          <Grid item>
            <Button
              onClick={() => setShowForm(true)}
              size="small"
              variant="contained"
              color="primary"
            >
              Add new item
            </Button>
          </Grid>
          <Grid>
            <Button
              onClick={() => setShowForm(false)}
              size="small"
              variant="contained"
              color="secondary"
            >
              View added items
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Header;
