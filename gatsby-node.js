/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path");
const {paginate}= require('gatsby-awesome-pagination');

module.exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const slug = path.basename(node.fileAbsolutePath, ".md")
    createNodeField({
      node,
      name: "slug",
      value: slug,
    })
  }
}

module.exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const blogTemplate = path.resolve("./src/templates/blog.js")
    const blogListTemplate = path.resolve("./src/templates/blogs.js")
    const respone = await graphql(`
      query {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `)

    if(respone.errors){
      reporter.panicOnBuild(`Error while running GraphQL query`);
      return;
    }

    paginate ({
      createPage,
      items: respone.data.allMarkdownRemark.edges,
      itemsPerPage: 2,
      pathPrefix: '/blogs',
      component: blogListTemplate
    });


    respone.data.allMarkdownRemark.edges.forEach((edge) => {
        createPage({
          component: blogTemplate,
          path: `/blogs/${edge.node.fields.slug}`,
          context: {
            slug: edge.node.fields.slug,
          }
        })
      })
};

module.exports.onCreatePage = async ({page, actions})=>{
  const {createPage}= actions;

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if(page.path.match(/^\/blogs/)){
    page.matchPath = "/blogs/*"
    createPage(page)
  }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    /*
     * During the build step, `auth0-js` will break because it relies on
     * browser-specific APIs. Fortunately, we don’t need it during the build.
     * Using Webpack’s null loader, we’re able to effectively ignore `auth0-js`
     * during the build. (See `src/utils/auth.js` to see how we prevent this
     * from breaking the app.)
     */
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /auth0-js/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}