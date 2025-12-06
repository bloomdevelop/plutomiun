import { Button } from "@fluentui/react-components";
import { NavLink } from "react-router";

export default function App() {
  return (
    <div>
      <Button appearance="primary">Hello!</Button>
      <NavLink to="/login">
        <Button appearance="outline">Login</Button>
      </NavLink>
    </div>
  );
}
