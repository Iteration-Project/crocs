import React, { useEffect, useState } from "react"
import styled from "styled-components"

const CheckboxWrapper = styled.label`
  display: grid;
  grid-template-columns: -webkit-min-content auto;
  grid-template-columns: min-content auto;
  grid-gap: 0.5em;
  align-items: center;
  font-size: 1rem;
  color: #7e55d8;
`

const CheckboxSpan = styled.span`
  display: grid;
  grid-template-areas: "checkbox";

  > * {
    grid-area: checkbox;
  }
`

const CheckboxInput = styled.input`
  opacity: 0;
  width: 1em;
  height: 1em;

  &:focus + span {
    box-shadow: 0 0 0 0.05em #fff, 0 0 0.15em 0.1em currentColor;
  }

  &:checked + span svg {
    transform: scale(1);
  }
`

const CheckboxControl = styled.span`
  display: inline-grid;
  width: 1em;
  height: 1em;
  border-radius: 0.25em;
  border: 0.1em solid currentColor;

  & svg {
    transition: transform 0.1s ease-in 25ms;
    transform: scale(0);
    transform-origin: bottom left;
  }
`

const LabelSpan = styled.span`
  color: black;
`

//   {
//   setAvailableSkills,
//   setCurrentSkills,
//   email,
//   label,
//   isChecked,
// }
export const Checkbox = (props) => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (props.isChecked) setChecked(true)
  }, [])

  // const skillButtonClick = () => {
  //   console.log("Skill button e ", label);
  //   data.skillsToTeach[label]
  //     ? setData((prevstate) => {
  //         delete prevstate.skillsToTeach[label];
  //         return prevstate;
  //       })
  //     : setData((prevstate) => {
  //         prevstate.skillsToTeach[label] = skillId[label];
  //         return prevstate;
  //       });
  // };

  const addNewSkill = async (arg) => {
    console.log("Argument ", arg)
    try {
      const res = await fetch("api/adduserskill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillName: arg, email: props.email }),
      })
      const response = await res.json()
      console.log("Response from add new skill ", response)
      response.sort((a, b) => (a.name > b.name ? 1 : -1))
      console.log("response is -->", response)
      const userAvailableSkills = []
      const userCurrentSkills = []
      for (let i = 0; i < response.length; i++) {
        for (let j = 0; j < response[i].teachers.length; j++) {
          if (response[i].teachers[j].email === props.email) {
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
      props.setAvailableSkills(userAvailableSkills)
      props.setCurrentSkills(userCurrentSkills)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteUserSkill = async (arg) => {
    try {
      const res = await fetch("api/deleteuserskill", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillName: arg, email: props.email }),
      })
      const response = await res.json()
      response.sort((a, b) => (a.name > b.name ? 1 : -1))
      console.log("response is -->", response)
      const userAvailableSkills = []
      const userCurrentSkills = []
      for (let i = 0; i < response.length; i++) {
        for (let j = 0; j < response[i].teachers.length; j++) {
          if (response[i].teachers[j].email === props.email) {
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
      props.setAvailableSkills(userAvailableSkills)
      props.setCurrentSkills(userCurrentSkills)
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = () => {
    if (checked) {
      deleteUserSkill(props.label)
    } else {
      addNewSkill(props.label)
    }
    setChecked(!checked)
  }

  return (
    <>
      <CheckboxWrapper>
        <CheckboxSpan>
          <CheckboxInput
            type="checkbox"
            name="checkbox"
            checked={checked}
            onChange={handleChange}
          />
          <CheckboxControl>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                d="M1.73 12.91l6.37 6.37L22.79 4.59"
              />
            </svg>
          </CheckboxControl>
        </CheckboxSpan>
        <LabelSpan>{props.label}</LabelSpan>
      </CheckboxWrapper>
    </>
  )
}
