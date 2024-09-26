import styled from "styled-components"

const SkillsList = ({ orientation = 'vertical"', children }) => {
  let Component
  if (orientation === "horizontal") {
    Component = HorizontalList
  } else {
    Component = VerticalList
  }

  return <Component orientation={orientation}>{children}</Component>
}

const ListBase = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px 4px;
`

const HorizontalList = styled(ListBase)`
  flex-direction: row;
`
const VerticalList = styled(ListBase)`
  flex-direction: column;
`

export default SkillsList
