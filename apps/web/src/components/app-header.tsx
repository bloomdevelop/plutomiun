import {
  makeStyles,
  Popover,
  PopoverTrigger,
  Button,
  tokens,
  Avatar,
  PopoverSurface,
  Body1,
} from "@fluentui/react-components";
import { useStoat } from "../contexts/stoat";
import convertPresence from "../utils/convert-presence";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "end",
    padding: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalL,
    height: "48px",
    background: tokens.colorNeutralBackground4,
    boxSizing: "border-box",
  },
});

export default function AppHeader() {
  const { user } = useStoat();
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
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
        <PopoverSurface>
          <Body1>{user?.displayName || user?.username || "Unknown"}</Body1>
        </PopoverSurface>
      </Popover>
    </div>
  );
}
