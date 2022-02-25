import { render } from "@testing-library/react";
import Button from "../client/component/Button/Button";

describe("Rendering button", () => {
  test("check text", () => {
    render(<Button />);
  });
});
