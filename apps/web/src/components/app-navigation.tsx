import {
  Caption1,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { ChatIcon, ServerMultipleIcon } from "../utils/icons";
import {
  iconFilledClassName,
  iconRegularClassName,
} from "@fluentui/react-icons";
import { NavLink, useLocation } from "react-router";

const useStyles = makeStyles({
  root: {
    display: "flex",
    gap: tokens.spacingVerticalS,
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
    overflowY: "auto",
    overflowX: "unset",
    background: tokens.colorNeutralBackground4,
    minWidth: "68px",
    position: "relative",
    "::after": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: "1px",
      backgroundColor: tokens.colorNeutralForeground1,
      opacity: 0.1,
    },
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: tokens.spacingVerticalS,
    userSelect: "none",
    WebkitUserSelect: "none",
    minWidth: "68px",
    minHeight: "68px",
    textDecoration: "none",
    color: tokens.colorNeutralForeground1,
  },
  navItemSelected: {
    color: tokens.colorBrandBackground,
    [`& .${iconFilledClassName}`]: {
      display: "block",
    },
    [`& .${iconRegularClassName}`]: {
      display: "none",
    },
    ":hover": {
      background: tokens.colorNeutralBackground4Hover,
    },
  },
  navItemUnselected: {
    ":hover": {
      background: tokens.colorNeutralBackground4Hover,
      color: tokens.colorBrandBackground,
      [`& .${iconFilledClassName}`]: {
        display: "block",
      },
      [`& .${iconRegularClassName}`]: {
        display: "none",
      },
    },
  },
});

function AppNavigationItem({
  icon,
  name,
  to,
}: {
  icon: React.ReactNode;
  name: string;
  to: string;
}) {
  const styles = useStyles();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={mergeClasses(
        styles.navItem,
        isActive ? styles.navItemSelected : styles.navItemUnselected
      )}
    >
      {icon}
      <Caption1>{name}</Caption1>
    </NavLink>
  );
}

export default function AppNavigation() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <AppNavigationItem icon={<ChatIcon fontSize={20} />} name="Chat" to="/" />
      <AppNavigationItem
        icon={<ServerMultipleIcon fontSize={20} />}
        name="Servers"
        to="/servers"
      />
    </div>
  );
}
