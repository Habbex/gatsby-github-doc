import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"


export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
      }
      html
    }
  }
`

const BlogPost =(props)=>{
    return (
        <Layout>
        <SEO title={props.data.markdownRemark.frontmatter.title} />

          <section>
            <header >
              <h2>{props.data.markdownRemark.frontmatter.title}</h2>
            </header>
            <p>{props.data.markdownRemark.frontmatter.date}</p>
            <div
              dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }}
            > 
            </div>
          </section>
      </Layout>
    )
}

export default BlogPost