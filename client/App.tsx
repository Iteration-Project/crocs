import React, { useState, useEffect, lazy, Suspense } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import useLocalStorage from "./hooks/useLocalStorage"
import NewMessages from "./component/NewMessages"

// Styles
import "@fontsource/inter"
import GlobalStyles, { Loading } from "./GlobalStyles"
import "./index.scss"
import { CircularProgress } from "@material-ui/core"

//lazy loading components to split bundle.js into chunks
const Landing = lazy(() => import("./pages/LandingPage/Landing"))
const MainPage = lazy(() => import("./pages/MainPage"))
const ErrorPage = lazy(() => import("./pages/ErrorPage"))
const Settings = lazy(() => import("./pages/SettingsPage/SettingsPage"))

const App = () => {
  //state updated on login, signup
  const [auth, setAuth] = useState(false)
  //token stored upon successful auth to replace sessions.
  const authToken = localStorage.getItem("token")

  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useLocalStorage("user", {})

  // Do not change; default state must be null;
  const [recipient, setRecipient] = useState(null)
  //verifying token from localStorage on mount and auth to avoid hacked localStorage
  //checked every time we refresh browser or load one of urls in browser

  useEffect(() => {
    fetchData()
  }, [auth])

  const fetchData = async () => {
    try {
      if (authToken) {
        const res = await fetch("auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: authToken }),
        })
        const data = await res.json()
        if (data.verified === true) {
          setAuth(true)
        } else {
          localStorage.clear()
          setAuth(false)
        }
      } else {
        setAuth(false)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="maindiv">
      {isLoading && (
        <Loading>
          <CircularProgress />
        </Loading>
      )}
      {!isLoading && (
        <Suspense
          fallback={
            <Loading>
              <CircularProgress />
            </Loading>
          }
        >
          <Switch>
            {/*
            if authorized upon visiting one of the routes will be loaded component,
            otherwise will be redirected to landing page
             */}

            <Route exact path="/">
              {auth ? (
                <Redirect to="/main" />
              ) : (
                <Landing
                  setCurrentUser={setCurrentUser}
                  auth={auth}
                  setAuth={setAuth}
                />
              )}
            </Route>

            <Route exact path="/main">
              {auth ? (
                <MainPage
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  setRecipient={setRecipient}
                  recipient={recipient}
                  setAuth={setAuth}
                />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/settings">
              {auth ? (
                <Settings auth={auth} setAuth={setAuth} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>

            <Route exact path="/new-messages">
              <NewMessages />
            </Route>

            <Route path="/404" component={ErrorPage} />
            <Redirect to="/404" />
          </Switch>
        </Suspense>
      )}
      <GlobalStyles />
    </div>
  )
}

export default App
