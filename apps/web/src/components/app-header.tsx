import {
  makeStyles,
  Popover,
  PopoverTrigger,
  Button,
  tokens,
  Avatar,
  PopoverSurface,
  Body1Strong,
  Body1,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Link,
  PresenceBadge,
} from "@fluentui/react-components";
import { useStoat } from "../contexts/stoat";
import convertPresence from "../utils/convert-presence";
import { NavLink } from "react-router";
import { ChevronRightIcon, EditIcon, OpenIcon } from "../utils/icons";
import { User } from "stoat.js";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "end",
    paddingInline: tokens.spacingHorizontalL,
    height: "48px",
    background: tokens.colorNeutralBackground4,
  },
  popoverSurface: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  popoverSurfaceHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  popoverSurfaceAvatar: {
    width: "48px",
    height: "48px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    gap: tokens.spacingHorizontalMNudge,
    alignItems: "center",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  microsoftAccountLink: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    gap: "4px",
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBlock: tokens.spacingVerticalXS,
    paddingInline: tokens.spacingHorizontalM,
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    borderRadius: tokens.borderRadiusMedium,
  },
  menuItemLeft: {
    paddingLeft: "74px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  statusIcon: {
    color: tokens.colorPaletteGreenForeground1,
  },
  editIcon: {
    color: tokens.colorNeutralForeground2,
  },
  signOutLink: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase200,
    textDecoration: "none",
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  online: {
    color: tokens.colorPaletteGreenForeground1,
  },
  away: {
    color: tokens.colorPaletteYellowForeground1,
  },
  focus: {
    color: tokens.colorPaletteBlueForeground2,
  },
  busy: {
    color: tokens.colorPaletteRedForeground1,
  },
  offline: {
    color: tokens.colorNeutralForeground3,
  },
});

function StatusIcon({
  user,
  size,
}: {
  user: User;
  size?:
    | "medium"
    | "large"
    | "small"
    | "tiny"
    | "extra-small"
    | "extra-large"
    | undefined;
}) {
  switch (convertPresence(user)) {
    case "available":
      return <PresenceBadge size={size} status="available" />;
    case "away":
      return <PresenceBadge size={size} status="away" />;
    case "do-not-disturb":
      return <PresenceBadge size={size} status="do-not-disturb" />;
    case "busy":
      return <PresenceBadge size={size} status="busy" />;
    case "offline":
      return <PresenceBadge size={size} status="offline" />;
    default:
      return <PresenceBadge size={size} status="available" />;
  }
}

export default function AppHeader() {
  const { user, account } = useStoat();
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Button
            size="large"
            appearance="subtle"
            shape="circular"
            icon={
              <Avatar
                size={28}
                name={user?.displayName || user?.username || "Unknown"}
                image={{
                  src: user?.avatarURL,
                }}
                badge={{
                  status: convertPresence(user),
                }}
              />
            }
          />
        </PopoverTrigger>
        <PopoverSurface className={styles.popoverSurface}>
          {user && account ? (
            <>
              <div className={styles.popoverSurfaceHeader}>
                <Body1Strong>Personal</Body1Strong>
                <Link className={styles.signOutLink}>Sign out</Link>
              </div>

              <div className={styles.userInfo}>
                <Avatar
                  className={styles.popoverSurfaceAvatar}
                  name={user?.displayName || user?.username || "Unknown"}
                  image={{
                    src: user?.avatarURL,
                  }}
                />
                <div className={styles.userDetails}>
                  <Body1Strong>
                    {user?.displayName || user?.username || "Unknown"}
                  </Body1Strong>
                  <Link
                    href="https://stoat.chat/app"
                    className={styles.microsoftAccountLink}
                  >
                    Go to main instance <OpenIcon style={{ fontSize: 16 }} />
                  </Link>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Menu positioning="below">
                  <MenuTrigger disableButtonEnhancement>
                    <div className={styles.menuItem}>
                      <div className={styles.menuItemLeft}>
                        <StatusIcon user={user} size="medium" />
                        <Body1>
                          {convertPresence(user) === "available"
                            ? "Available"
                            : convertPresence(user) === "away"
                              ? "Away"
                              : convertPresence(user) === "do-not-disturb"
                                ? "Do not disturb"
                                : convertPresence(user) === "busy"
                                  ? "Busy"
                                  : convertPresence(user) === "offline"
                                    ? "Offline"
                                    : "Unknown"}
                        </Body1>
                      </div>
                      <ChevronRightIcon fontSize={20} />
                    </div>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem icon={<PresenceBadge status="available" />}>
                        Online
                      </MenuItem>
                      <MenuItem icon={<PresenceBadge status="away" />}>
                        Away
                      </MenuItem>
                      <MenuItem
                        icon={<PresenceBadge status="do-not-disturb" />}
                      >
                        Do not disturb
                      </MenuItem>
                      <MenuItem icon={<PresenceBadge status="busy" />}>
                        Focus
                      </MenuItem>
                      <MenuItem icon={<PresenceBadge status="offline" />}>
                        Offline
                      </MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>

                <div className={styles.menuItem}>
                  <div className={styles.menuItemLeft}>
                    <EditIcon fontSize={20} className={styles.editIcon} />
                    <Body1>Set status message</Body1>
                  </div>
                  <ChevronRightIcon fontSize={20} />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.popoverSurfaceHeader}>
              <Body1Strong>Personal</Body1Strong>
              <NavLink to="/login">
                <Button appearance="subtle">Log In</Button>
              </NavLink>
            </div>
          )}
        </PopoverSurface>
      </Popover>
    </div>
  );
}
