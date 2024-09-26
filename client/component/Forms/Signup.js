import React, { useState, useEffect } from "react"
import styled from "styled-components"
import findSSIDCookie from "../../utils/findSSIDCookie"
// Components
import Input from "./Input"
import Label from "./Label"
import Button from "../Button/Button"
import { Checkbox } from "../Checkbox"
import Form from "./Form"

const SkillWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 4px;
`

const Signup = ({ setAuth, setCurrentUser }) => {
  //state to hold info for authorization
  const [data, setData] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    skillsToTeach: {},
  })
  //state to handle skills available in database
  const [skills, setSkills] = useState([])
  const [skillId, setSkillId] = useState({})
  //state to conditionally render error message on unsuccessfull signup
  const [errorOnSignup, setErrorOnSignup] = useState(false)

  //getting skills on mount from backend
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const res = await fetch("/api/allSkills/all")
      const response = await res.json()
      const skillNames = []
      for (let i = 0; i < response.length; i++) {
        skillNames.push(response[i].name)
        setSkillId((prevstate) => {
          prevstate[response[i].name] = response[i]._id
          return prevstate
        })
      }
      setSkills(skillNames)
    } catch (err) {
      console.log(err)
    }
  }

  // func to submit auth info. updates states of errors on unsuccessful signup.
  // on successful signup stores cookie as token in localStorage;
  // finds if user is admin, has messages and stores data in localStorage;
  // sets auth to true and redirects to '/main';
  const postSignup = async (signupData) => {
    return fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    })
  }

  const authorize = async () => {
    try {
      const signupData = await postSignup(data)
      const signupResponse = await signupData.json()
      if (!signupResponse.hasLogged) {
        setErrorOnSignup(true)
      } else if (signupResponse.hasLogged === "format") {
        setErrorOnSignup("format")
      } else if (signupResponse.hasLogged === "empty") {
        setErrorOnSignup("empty")
      } else if (signupResponse.hasLogged) {
        const ssidToken = findSSIDCookie(document.cookie)
        console.log(data)
        setCurrentUser(data)
        localStorage.setItem("email", `${data.email}`)
        if (ssidToken) {
          localStorage.setItem("token", ssidToken)
          localStorage.setItem(
            "name",
            `${signupResponse.userInfo.firstName} ${signupResponse.userInfo.lastName}`,
          )
        }
        if (signupResponse.userInfo.isAdmin) {
          localStorage.setItem("admin", "true")
        }
        setAuth(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (
      errorOnSignup === true ||
      errorOnSignup === "format" ||
      errorOnSignup === "empty"
    ) {
      setTimeout(() => {
        setErrorOnSignup(false)
      }, 3000)
    }
  }, [errorOnSignup])

  return (
    <Form>
      {errorOnSignup === true && (
        <div className="loginerror-message">
          This email is registered in our system. Please try to login.
        </div>
      )}
      {errorOnSignup === "empty" && (
        <div className="loginerror-message">All fields are required.</div>
      )}
      {errorOnSignup === "format" && (
        <div className="errordiv">
          <div className="loginerror-message">
            Incorrect email format. Please enter valid email.
          </div>
        </div>
      )}
      <Label>
        Email:
        <Input
          type="email"
          placeholder="Enter email"
          onChange={(e) =>
            setData((data) => ({ ...data, email: e.target.value }))
          }
        />
      </Label>
      <Label>
        Password:
        <Input
          type="password"
          placeholder="Enter password"
          onChange={(e) =>
            setData((data) => ({ ...data, password: e.target.value }))
          }
        />
      </Label>
      <Label>
        First Name:
        <Input
          type="name"
          placeholder="Enter first name"
          onChange={(e) =>
            setData((data) => ({ ...data, firstName: e.target.value }))
          }
        />
      </Label>
      <Label>
        Last Name:
        <Input
          type="name"
          placeholder="Enter last name"
          onChange={(e) =>
            setData((data) => ({ ...data, lastName: e.target.value }))
          }
        />
      </Label>
      <Label>
        Select skills would you like to teach:
        <SkillWrapper>
          {skills.map((skill) => (
            <Checkbox
              key={skill}
              id={skill}
              data={data}
              setData={setData}
              skillId={skillId}
              label={skill}
            />
          ))}
        </SkillWrapper>
      </Label>
      <Button variant="submit" onClick={authorize}>
        Sign Up
      </Button>
    </Form>
  )
}

export default Signup
