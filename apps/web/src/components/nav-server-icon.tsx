import {
  makeStyles,
  mergeClasses,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import {
  iconFilledClassName,
  iconRegularClassName,
} from "@fluentui/react-icons";
import { NavLink, useLocation } from "react-router";

const useStyles = makeStyles({
  linkIcon: {
    display: "inline-flex",
    boxSizing: "border-box",
    justifyContent: "center",
    alignItems: "center",
    width: "48px",
    height: "48px",
    textDecoration: "none",
    padding: "8px",
    borderRadius: tokens.borderRadiusLarge,
    transitionProperty: "background-color, color",
    transitionDuration: tokens.durationGentle,
  },
  linkIconUnselected: {
    color: tokens.colorNeutralForeground2,
    ":hover": {
      background: tokens.colorNeutralBackground4Hover,
    },
  },
  linkIconSelected: {
    color: tokens.colorNeutralForegroundOnBrand,
    background: tokens.colorBrandBackground,
    [`& .${iconFilledClassName}`]: {
      display: "block",
    },
    [`& .${iconRegularClassName}`]: {
      display: "none",
    },
    boxShadow: tokens.shadow8,
  },
});

export default function NavServerIcon({
  to,
  name,
  slot,
}: {
  to: string;
  name: string;
  slot: React.ReactNode;
}) {
  const styles = useStyles();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Tooltip content={name} positioning="after" withArrow relationship="label">
      <NavLink
        to={to}
        className={mergeClasses(
          styles.linkIcon,
          isActive ? styles.linkIconSelected : styles.linkIconUnselected
        )}
      >
        {slot}
      </NavLink>
    </Tooltip>
  );
}
