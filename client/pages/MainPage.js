import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Loading } from "../GlobalStyles"
import { ForceGraph } from "../component/ForceGraph/ForceGraph"
import { CircularProgress } from "@material-ui/core"
import SkillsList from "../component/Skill/SkillsList"
import Navbar from "../component/Navbar/Navbar"
import Chat from "./Chat"

const MainPage = (props) => {
  //state passed to nodes of ForceGraph to select user on click on node in graph
  //and pass to SendMessage component as prop
  const [selectedUser, setSelectedUser] = useState({})
  //state to hold all data fetched on mount and passed to ForceGraph
  const [graphData, setGraphData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeStyle, setActiveStyle] = useState("text-active")
  // checking if user has new messages/requests in localStorage
  // stored upon successful auth
  const newMessage = localStorage.getItem("newMessage")

  // checking if user is admin in localStorage
  // stored upon successful auth
  const isAdmin = localStorage.getItem("admin")

  // func to display tooltip on hover over node in ForceGraph.
  // passed as prop to ForceGraph
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.name}</div>`
  }, [])

  // func triggered onclick on node in ForceGraph.
  // sets selectedUser state to render SendMessage component
  function getNodeInfo(nodeInfo) {
    return setSelectedUser(nodeInfo)
  }

  // updates class in SkillsList after 2 sec
  useEffect(() => {
    setTimeout(() => {
      if (activeStyle === "text-inactive") setActiveStyle("text-active")
    }, 2000)
  }, [activeStyle])

  // IIFY syntax: https://dev.to/stlnick/useeffect-and-async-4da8
  useEffect(() => {
    ;(async () => {
      try {
        const resp = await fetch("/api/nodes/all")
        const data = await resp.json()
        setGraphData(data)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <div className="mainpage">
      <Navbar
        setCurrentUser={props.setCurrentUser}
        isAdmin={isAdmin}
        newMessage={newMessage}
        setAuth={props.setAuth}
      />

      {props.recipient && (
        <Chat
          currentUser={props.currentUser}
          recipient={props.recipient}
          setRecipient={props.setRecipient}
        />
      )}

      {isLoading && (
        <Loading>
          <CircularProgress />
        </Loading>
      )}
      {!isLoading && (
        <section>
          {graphData.nodes !== undefined && (
            <>
              <SkillsList
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
                skills={graphData.skills}
                setGraphData={setGraphData}
              />
              <ForceGraph
                setRecipient={props.setRecipient}
                skillsData={graphData.skills}
                linksData={graphData.links}
                nodesData={graphData.nodes}
                nodeHoverTooltip={nodeHoverTooltip}
                getNodeInfo={getNodeInfo}
                setActiveStyle={setActiveStyle}
                activeStyle={activeStyle}
              />
            </>
          )}
        </section>
      )}
    </div>
  )
}

MainPage.propTypes = {
  setAuth: PropTypes.func,
  currentUser: PropTypes.object,
  setCurrentUser: PropTypes.func,
  recipient: PropTypes.object,
  setRecipient: PropTypes.func,
}

export default MainPage
