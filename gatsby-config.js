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
        patterns: [`src/**/*.{md, jpg, png}`]
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
