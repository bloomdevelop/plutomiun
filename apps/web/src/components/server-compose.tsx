import {
  Button,
  Divider,
  Input,
  makeStyles,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { AttachIcon, SendIcon } from "../utils/icons";
import { Channel } from "stoat.js";
import { useState } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalM,
    marginInline: tokens.spacingHorizontalXXXL,
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
  },
  input: {
    flex: "1",
  },
});

export default function ServerCompose({ channel }: { channel?: Channel }) {
  const styles = useStyles();
  const [content, setContent] = useState("");

  const handleSend = async () => {
    if (!channel || !content.trim()) return;
    try {
      await channel.sendMessage(content);
      setContent("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={styles.root}>
      <Input
        size="large"
        className={styles.input}
        placeholder={`Message ${channel?.name ? "#" + channel.name : ""}`}
        value={content}
        onChange={(_e, data) => setContent(data.value)}
        onKeyDown={handleKeyDown}
        disabled={!channel}
        contentAfter={
          <div className={styles.toolbar}>
            <Tooltip
              content="Attach Files"
              positioning="above"
              relationship="label"
            >
              <Button
                icon={<AttachIcon />}
                appearance="subtle"
                disabled={!channel}
              />
            </Tooltip>
            <Divider vertical />
            <Tooltip content="Send" positioning="above" relationship="label">
              <Button
                icon={<SendIcon />}
                appearance="subtle"
                onClick={handleSend}
                disabled={!channel || !content.trim()}
              />
            </Tooltip>
          </div>
        }
      />
    </div>
  );
}
