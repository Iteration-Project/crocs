import Container from "../component/Container"
import styled from "styled-components"

/*
  Component renders when visiting not existing route
*/
const TopLine = styled.p`
  color: #7f56d9;
  font-size: 18px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: 1.4px;
  margin-bottom: 16px;
`

const Heading = styled.h1`
  margin-bottom: 24px;
  font-size: 48px;
  line-height: 1.1;
  font-weight: 600;
  color: #1c2237;
`

const ErrorPage = () => {
  return (
    <Container>
      <TopLine>404</TopLine>
      <Heading> Page Not Found</Heading>
    </Container>
  )
}

export default ErrorPage
