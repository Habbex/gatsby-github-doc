import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import { Grid, OutlinedInput, FormControl, InputAdornment, Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';
import { logout, getProfile } from "../utils/auth";
import Pagination from "../components/pagination"

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


const BlogIndex = ({ data, pageContext }) => {
  const allPosts = data.allMarkdownRemark.edges
  const emptyQuery = ""
  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery,
  })

  const handleInputChange = event => {
    console.log(event.target.value)
    const query = event.target.value
    const posts = data.allMarkdownRemark.edges || []

    const filteredData = posts.filter(post => {
      const { title } = post.node.frontmatter
      const { excerpt, html } = post.node
      return (
        excerpt.toLowerCase().includes(query.toLowerCase()) ||
        title.toLowerCase().includes(query.toLowerCase()) ||
        html.toLowerCase().includes(query.toLowerCase())
      )
    })
    setState({
      query,
      filteredData,
    })
  }

  const { filteredData, query } = state
  const hasSearchResults = filteredData && query !== emptyQuery
  const posts = hasSearchResults ? filteredData : allPosts
  const classes = useStyles();


  const user = getProfile()
  return (
    <Layout>
      <div>
        <Grid container justify="center" direction="column">
          <Grid container item xs={12}>
            <Grid item xs={2} />
            <Grid item xs={8}>
              <h1 style={{ textAlign: `center` }}>Hello {user.name}</h1>
            </Grid>
            <Grid item xs={2}>
              <Grid container direction="row" alignItems="center" justify="space-around">
                <a
                  href="#logout"
                  onClick={e => {
                    logout()
                    e.preventDefault()
                  }}
                >
                  Log Out
                  </a>
                <ExitToAppIcon />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} justify="center">
            <Grid item xs={8}>
              <FormControl fullWidth>
                <OutlinedInput
                  className={classes.input}
                  placeholder="Search posts"
                  inputProps={{ 'aria-label': 'search posts' }}
                  onChange={handleInputChange}
                  endAdornment={<InputAdornment position="end"><SearchIcon /></InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item xs={8} justify="center">
              <Pagination pageContext={pageContext} />
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div>
        <Grid container justify="center">
          {posts.map(({ node }) => {
            const { excerpt } = node
            const { slug } = node.fields
            const { title, date, description, featuredImage, featuredImgAlt } = node.frontmatter
            return (
              <Grid item xs={10} key={slug} className={classes.paper}>
                <Link className={classes.link} to={`/blogs/${slug}`}>
                  <Card >
                    <CardActionArea>
                      <Img className={classes.image} fluid={featuredImage.childImageSharp.fluid} alt={featuredImgAlt} />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {title}
                        </Typography>
                        <Typography gutterBottom variant="body1" component="p" dangerouslySetInnerHTML={{
                          __html: description || excerpt,
                        }}>
                        </Typography>
                        <Typography variant="body1" color="textSecondary" component="p">
                          {date}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            )
          }
          )}
        </Grid>
      </div >
    </Layout >
  )
}

BlogIndex.propType = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
}

export const pageQuery = graphql`
query ($skip: Int!, $limit: Int!){
  allMarkdownRemark(
    sort: { fields: [frontmatter___date], order: DESC }
    limit: $limit
    skip: $skip
  ) {
    edges {
      node {
        excerpt(pruneLength: 500)
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          shortdescription
          featuredImage {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
          featuredImgAlt
        }
        fields {
          slug
        }
        html
      }
    }
  }
}
`

export default BlogIndex

