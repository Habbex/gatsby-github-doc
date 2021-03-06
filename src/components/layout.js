import React from "react"
import { Paper, Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import "./layout.css"

const Layout = ({ children }) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      padding: theme.spacing(8, 0, 6),
    },
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Grid container spacing={2} direction="column">
          <Paper className={classes.paper} elevation={3}>
              {children}
          </Paper>
        </Grid>
      </Container>
    </div>
  );
}


export default Layout
