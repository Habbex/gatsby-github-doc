import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import { Grid, OutlinedInput, FormControl, InputAdornment, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { logout, getProfile } from "../utils/auth";

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
    padding: theme.spacing(3),
  },
  link:{
    textAlign: 'center',
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
  image:{
    maxHeight:'60vh'
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
        <Grid container justify="center">
          <Grid item>
            <h1 style={{ textAlign: `center` }}>Hello {user.name}</h1>
            <a
              href="#logout"
              onClick={e => {
                logout()
                e.preventDefault()
              }}
            >
              Log Out
        </a>
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
        </Grid>
      </div>
      <div>
        <Grid container justify="center">
          {posts.map(({ node }) => {
            const { excerpt } = node
            const { slug } = node.fields
            const { title, date, description, featuredImage, featuredImgAlt } = node.frontmatter
            return (
              <Grid item md={10} className={classes.paper}>
                <Link className={classes.link} to={slug}>
                  <Card key={slug}>
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
            )}
          )}
        </Grid>
      </div >
    </Layout >
  )
}

BlogIndex.propType = {
  data: PropTypes.object.isRequired,
}

export const pageQuery = graphql`
query {
  allMarkdownRemark(sort: {order: DESC, fields: frontmatter___date}) {
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

