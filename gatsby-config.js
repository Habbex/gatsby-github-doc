const myPlugin = (lunr) => (builder) => {
  // removing stemmer
  builder.pipeline.remove(lunr.stemmer)
  builder.searchPipeline.remove(lunr.stemmer)
  // or similarity tuning
  builder.k1(1.3)
  builder.b(0)
}

module.exports = {
  siteMetadata: {
    title: `Dev handbook`,
    description: `Dev handbook static webpage`,
    author: `@Ehab Okal`,
    twitter:`https://www.twitter.com`,
    github: `https://www.github.com`,
    email: `mailto: ihabokal@hotmail.com`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    }, 
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-relative-images`,
            options: {
              name: "images" // Must match the source name ^
            }
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 590,
            },
          },
        ],
      },
    },{
      resolve: `gatsby-plugin-material-ui`,
      options: {
        disableAutoprefixing: false,
        disableMinification: false,
      },
    },    
    {
      resolve: `gatsby-source-git`,
      options: {
        name: `repo-one`,
        remote: `https://github.com/Habbex/ehabokal.git`,
        branch: `master`,
        // Only import the docs folder from a codebase.
        // patterns: [`src/**/*.{md, jpg, png}`]
        patterns: [`src/**`]
      },
    },
    // {
    //   resolve: `gatsby-source-git`,
    //   options: {
    //     name: `repo-two`,
    //     remote: `https://myuser:${process.env.GITHUB_TOKEN}@github.com/myuser/my-repo`,
    //     branch: `master`,
    //     // Only import the docs folder from a codebase.
    //     // patterns: [`src/**/*.{md, jpg, png}`]
    //     patterns: [`src/**`]
    //   },
    // },
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
          languages: [
              {
                  // ISO 639-1 language codes. See https://lunrjs.com/guides/language_support.html for details
                  name: 'en',
                  // A function for filtering nodes. () => true by default
                  // filterNodes: node => node.frontmatter.lang === 'en',
                  plugins:[myPlugin],
                  // Add to index custom entries, that are not actually extracted from gatsby nodes
                  // customEntries: [{ title: 'Pictures', content: 'awesome pictures', url: '/pictures' }],
              },
          ],
          // Fields to index. If store === true value will be stored in index file.
          // Attributes for custom indexing logic. See https://lunrjs.com/docs/lunr.Builder.html for details
          fields: [
              { name: 'title', store: true, attributes: { boost: 10 } },
              { name: 'content' ,store: true },
              { name: 'url', store: true },
          ],
          // How to resolve each field's value for a supported node type
          resolvers: {
              // For any node of type MarkdownRemark, list how to resolve the fields' values
              MarkdownRemark: {
                  title: node => node.frontmatter.title,
                  content: node => node.rawMarkdownBody,
                  url: node => node.fields.slug,
              },
          },
          //custom index file name, default is search_index.json
          filename: 'search_index.json',
          //custom options on fetch api call for search_ındex.json
          fetchOptions: {
              credentials: 'same-origin'
          },
      },
  },
    
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
