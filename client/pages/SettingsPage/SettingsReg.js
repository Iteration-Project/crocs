/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react"
import { Checkbox } from "./CheckboxSettings"
import Input from "../../component/Forms/Input"
import Button from "../../component/Button/Button"
import { Container } from "../../GlobalStyles"
// eslint-disable-next-line import/no-unresolved
import styled from "styled-components"

// eslint-disable-next-line no-unused-vars
const SettingsReg = (props) => {
  // holds the new skills the user may want to teach
  const [availableSkills, setAvailableSkills] = useState([])
  // holds skills the user already teaches
  const [currentSkills, setCurrentSkills] = useState([])
  // states below represent different errors
  const [error, setError] = useState(false)
  const [errorExist, setErrorExist] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const [wrongEmail, setWrongEmail] = useState(false)
  const [email, setNewEmail] = useState(localStorage.getItem("email"))
  const [emailChange, setEmailChange] = useState(false)

  // email validation func, returns boolean;
  function validateEmail(str) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(str).toLowerCase())
  }

  // calls func to fetch allSkills on mount;
  useEffect(() => {
    fetchData()
  }, [])

  // useEffects below set timeout to udate states of errors if errors are true in 1.5 sec;

  useEffect(() => {
    if (error === true) {
      setTimeout(() => {
        setError(false)
      }, 1500)
    }
  }, [error])

  useEffect(() => {
    if (emailChange === true) {
      setTimeout(() => {
        setEmailChange(false)
      }, 1500)
    }
  }, [emailChange])

  useEffect(() => {
    if (errorExist === true) {
      setTimeout(() => {
        setErrorExist(false)
      }, 1500)
    }
  }, [errorExist])

  useEffect(() => {
    if (errorEmail === true) {
      setTimeout(() => {
        setErrorEmail(false)
      }, 1500)
    }
  }, [errorEmail])

  useEffect(() => {
    if (wrongEmail === true) {
      setTimeout(() => {
        setWrongEmail(false)
      }, 1500)
    }
  }, [wrongEmail])

  // fetches data on mount;
  // GET request;
  // sorting skills to 2 states - availableSkills and currentSkills by finding if user id is present in skills teachers array of objects;

  const fetchData = async () => {
    try {
      const res = await fetch("/api/allSkills/all")
      const response = await res.json()
      response.sort((a, b) => (a.name > b.name ? 1 : -1))
      const userAvailableSkills = []
      const userCurrentSkills = []
      for (let i = 0; i < response.length; i++) {
        for (let j = 0; j < response[i].teachers.length; j++) {
          if (response[i].teachers[j].email === email) {
            userCurrentSkills.push(response[i])
            break
          }
        }
        if (userCurrentSkills.length === 0) {
          userAvailableSkills.push(response[i])
        } else if (
          userCurrentSkills[userCurrentSkills.length - 1].name !==
          response[i].name
        ) {
          userAvailableSkills.push(response[i])
        }
      }
      // update state: availableSkills and currentSkills
      setAvailableSkills(userAvailableSkills)
      setCurrentSkills(userCurrentSkills)
    } catch (err) {
      console.log(err)
    }
  }

  const emailTyped = (e) => {
    if (e.target.value === "") {
      setNewEmail(localStorage.getItem("email"))
    } else {
      setNewEmail(e.target.value)
    }
  }

  const updateEmail = async () => {
    try {
      if (!validateEmail(email) || email === localStorage.getItem("email")) {
        setWrongEmail(true)
        return
      }
      const res = await fetch("api/updateemail", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail: email,
          currentEmail: localStorage.getItem("email"),
        }),
      })
      const data = await res.json()
      console.log("data:", data)
      if (data === true) {
        console.log("update local and state email")
        localStorage.removeItem("email")
        localStorage.setItem("email", email)
        setEmailChange(true)
        setNewEmail(email)
        document.getElementsByClassName("change-email-form")[0].reset()
      } else {
        setErrorEmail(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 0px 20px;
    grid-template-areas: ". .";
  `

  const Gap = styled.hr`
    margin-top: 40px;
    margin-bottom: 40px;
    border: 1px solid #f5f5f5;
  `

  const PageHeading = styled.h1`
    margin-top: 40px;
    color: #171717;
  `

  const SectionHeading = styled.h2`
    color: #171717;
  `

  const InputGroup = styled.div`
    display: flex;
  `

  const Paragraph = styled.p`
    color: #171717;
  `

  return (
    <Container>
      <div>
        <br />
        <PageHeading>Settings</PageHeading>
        <Paragraph>
          The adjustments made here will take effect as soon as they are set.
        </Paragraph>
      </div>
      <Gap />
      <div>
        <SectionHeading>Email</SectionHeading>
        {emailChange && <div>Email successfully updated</div>}
        {errorEmail && (
          <div>Technical error occured. Please contact Support</div>
        )}
        {wrongEmail && <div>Please enter correct email</div>}
        <Grid>
          <Paragraph>Update your email here.</Paragraph>
          <InputGroup>
            <Input
              type="email"
              variant="with-button"
              placeholder={`${email}`}
              onChange={emailTyped}
            />
            <Button type="button" size="small" onClick={updateEmail}>
              Update
            </Button>
          </InputGroup>
        </Grid>
      </div>
      <Gap />
      <SectionHeading>Skills</SectionHeading>
      <Grid>
        <Paragraph>
          Add or remove skills you would like to teach be checking the boxes.
        </Paragraph>
        <div>
          {availableSkills.map((skill) => {
            return (
              <Checkbox
                type="checkbox"
                key={skill._id}
                email={email}
                setAvailableSkills={setAvailableSkills}
                setCurrentSkills={setCurrentSkills}
                label={skill.name}
              />
            )
          })}
          {currentSkills.map((skill) => {
            return (
              <Checkbox
                type="checkbox"
                key={skill._id}
                email={email}
                isChecked={true}
                setAvailableSkills={setAvailableSkills}
                setCurrentSkills={setCurrentSkills}
                label={skill.name}
              />
            )
          })}
        </div>
      </Grid>
    </Container>
  )
}

export default SettingsReg
