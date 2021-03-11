import React, { useState } from 'react'
import { Link } from 'gatsby'
import lunr from "lunr"
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  OutlinedInput,
  FormControl,
  InputAdornment,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
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
  link: {
    textAlign: 'center',
    textDecoration: 'none',
    color: theme.palette.text.primary,
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

  const search = e => {
    const query = e.target.value;
    const results = getSearchResults(query);
    setState({ results, query });
    console.log(results)
  }

  const getSearchResults = (q) => {
    if (!q || !window.__LUNR__) {
      return [];
    }
    const keywords = q
      .trim() // remove trailing and leading spaces
      .replace(/\*/g, "") // remove user's wildcards
      .toLowerCase()
      .split(/\s+/) // split by whitespaces

    // do nothing if the last typed keyword is shorter than 2
    if (keywords[keywords.length - 1].length < 2) {
      return [];
    }
    const lunrIndex = window.__LUNR__["en"];
    // const results= lunrIndex.index.search(query)

    const results = lunrIndex.index.query((q) => {
      keywords.filter(el => el.length > 1).forEach(el => {
        q.term(el, { editDistance: el.length > 5 ? 1 : 0 })
        q.term(el, {
          wildcard:
            lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
        })
      })
    })
    return results.map(({ ref }) => lunrIndex.store[ref]);
  }

  const hideDividerOnLastOrOnlyOneResult =(currentIndex, resultCount ) =>{
    if(currentIndex < 2 & resultCount > 1){
      return true;
    }
    else{
      return false;
    } 
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
      {state.results.length > 0 && <Grid item xs={8}>
        <Paper>
          <List>
            {state.results.slice(0, 3).map((page, index) => (
              <Link className={classes.link} key={index} to={`/blogs/${page.url}`}>
                <ListItem button>
                  <ListItemText primary={page.title} className={classes.link} />
                </ListItem>
                {hideDividerOnLastOrOnlyOneResult(index, state.results.length) && <Divider />}
              </Link>
            ))}
          </List>
        </Paper>
      </Grid>}
    </>
  )
}



export default Search
