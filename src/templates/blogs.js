import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import { Grid, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { login, isAuthenticated, getProfile } from "../utils/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
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
      const { excerpt } = post.node
      return (
        excerpt.toLowerCase().includes(query.toLowerCase()) ||
        title.toLowerCase().includes(query.toLowerCase())
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

  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  const user = getProfile()
  return (
    <Layout>
      <h1 style={{ textAlign: `center` }}>Hello {user.name}</h1>
      <div>
        <Grid item xs={12}>
          <InputBase
            className={classes.input}
            placeholder="Search posts"
            inputProps={{ 'aria-label': 'search posts' }}
            onChange={handleInputChange}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Grid>
      </div>
      {posts.map(({ node }) => {
        const { excerpt } = node
        const { slug } = node.fields
        const { title, date, description, featuredImage, featuredImgAlt } = node.frontmatter
        return (
          <article key={slug}>
            <header>
              <h2>
                <Link to={slug}>{title}</Link>
              </h2>
              <Img src={featuredImage} alt={featuredImgAlt} />
              <p>{date}</p>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: description || excerpt,
                }}
              />
            </section>
            <hr />
          </article>
        )
      })}
    </Layout>
  )
}

BlogIndex.propType = {
  data: PropTypes.object.isRequired,
}

export const pageQuery = graphql`
query {
  allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
    edges {
      node {
        excerpt(pruneLength: 200)
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          shortdescription
          featuredImage
          featuredImgAlt
        }
        fields {
          slug
        }
      }
    }
  }
}
`

export default BlogIndex

