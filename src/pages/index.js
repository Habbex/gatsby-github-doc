import React from "react"
import Layout from "../components/layout"
import {login, isAuthenticated} from "../utils/auth";
import { Router } from "@reach/router"

const Home= ()=>{};
const IndexPage = () => {
    // if (!isAuthenticated()) {
    //     login()
    //     return <p>Redirecting to login...</p>
    //   }
      return(
          <>
          <Layout>
            <Router>
                <Home path="/blogs"/>
            </Router>
          </Layout>
          </>
      )
}

export default IndexPage
