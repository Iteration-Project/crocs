import { render } from "@testing-library/react"
import Login from "../component/Forms/Login"

test("login form", () => {
  const setAuth = jest.fn()
  const setCurrentUser = jest.fn()
  const { getByLabelText, getByText } = render(
    <Login setAuth={setAuth} setCurrentUser={setCurrentUser} />,
  )
  getByLabelText(/email/i)
  getByLabelText(/password/i)
  getByText(/log in/i)
})
