import React, { useState } from 'react'
import { Link } from 'gatsby'

import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, OutlinedInput, FormControl, InputAdornment ,Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
      input: {
        margin: theme.spacing(1),
        padding: '2px 0px',
        flex: 1,
      },
      divider: {
        height: 28,
        margin: 4,
      },
      paper: {
        padding: theme.spacing(4),
      },
      link: {
        textAlign: 'center',
        textDecoration: 'none',
        color: theme.palette.text.secondary,
      },
      image: {
        maxHeight: '60vh'
      }
  }));

const Search = () => {
    const classes = useStyles();
    const [state, setState] = useState({
        results: [],
        query: '',
      })

    const getSearchResults = (query) => {
        if (!query || !window.__LUNR__) {
            return [];
        }
        const lunrIndex =  window.__LUNR__["en"];
        const results= lunrIndex.index.search(query)
        return results.map(({ref})=> lunrIndex.store[ref]);
    }
    
    const search = event => {
        const query= event.target.value;
        const results= getSearchResults(query);
        setState({results, query});
    }

    return (
        <>
             <Grid item xs={8}>
              <FormControl fullWidth>
                <OutlinedInput
                  className={classes.input}
                  placeholder="Search posts"
                  inputProps={{ 'aria-label': 'search posts' }}
                  onChange={search}
                  endAdornment={<InputAdornment position="end"><SearchIcon /></InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid container item xs={12} justify="center">
                {state.results.map((page)=>(
                     <Grid item xs={10} key={page.url} className={classes.paper}>
                     <Link className={classes.link} to={`/blogs/${page.url}`}>
                       <Card >
                         <CardActionArea>
                           {/* <Img className={classes.image} fluid={featuredImage.childImageSharp.fluid} alt={featuredImgAlt} /> */}
                           <CardContent>
                             <Typography gutterBottom variant="h5" component="h2">
                               {page.title}
                             </Typography>
                             <Typography gutterBottom variant="body1" component="p" dangerouslySetInnerHTML={{
                               __html: page.content
                             }}>
                             </Typography>
                             <Typography variant="body1" color="textSecondary" component="p">
                               {/* {date} */}
                             </Typography>
                           </CardContent>
                         </CardActionArea>
                       </Card>
                     </Link>
                   </Grid>
                ))}
          </Grid>
        </>
    )
}



export default Search
