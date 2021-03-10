import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const Pagination = ({ pageContext }) => {

    const { previousPagePath, nextPagePath } = pageContext;

    return (
        <div>
            <Grid container item spacing={2}>
                <Grid item xs={2}>
                    {previousPagePath && (
                        <Link to={previousPagePath}>
                            <Grid container direction="row" alignItems="center" justify="space-around">
                                <ArrowBackIcon />
                                Prev
                            </Grid>
                        </Link>
                    )}
                </Grid>
                <Grid item xs={8} />
                <Grid item xs={2}>
                    {nextPagePath && (
                        <Link to={nextPagePath}>
                            <Grid container direction="row" alignItems="center" justify="space-around">
                                Next
                                <ArrowForwardIcon />
                            </Grid>
                        </Link>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

Pagination.propTypes = {
    pageContext: PropTypes.object.isRequired
};

export default Pagination;