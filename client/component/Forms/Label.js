import styled from "styled-components"

const LabelElement = styled.label`
  display: block;
  margin-bottom: 16px;
`

const Label = ({ labelFor, children }) => {
  return <LabelElement htmlFor={labelFor}>{children}</LabelElement>
}

export default Label
