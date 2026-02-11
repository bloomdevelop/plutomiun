import { makeStyles, Tab, TabList } from "@fluentui/react-components";
import { EmojiIcon } from "../utils/icons";
import { useState } from "react";

const useEmojiPickerStyles = makeStyles({
  root: {
    width: "320px",
    height: "380px",
    display: "flex",
    flexDirection: "column",
  },
  tab: {
    justifyContent: "center",
  },
  content: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#616161",
    fontSize: "14px",
  },
});

export default function EmojiPicker() {
  const styles = useEmojiPickerStyles();
  const [selectedTab, setSelectedTab] = useState("emoji");

  return (
    <div className={styles.root}>
      <TabList
        className={styles.tab}
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab icon={<EmojiIcon />} value="emoji">
          Emoji
        </Tab>
      </TabList>

      <div className={styles.content}>
        <div className={styles.emptyState}>Emoji picker coming soon...</div>
      </div>
    </div>
  );
}
