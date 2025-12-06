import {
  Button,
  Input,
  makeStyles,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { SendIcon } from "../utils/icons";
import { Channel } from "stoat.js";
import { useState } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalM,
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalM,
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
        className={styles.input}
        placeholder={`Message ${channel?.name ? "#" + channel.name : ""}`}
        value={content}
        onChange={(_e, data) => setContent(data.value)}
        onKeyDown={handleKeyDown}
        disabled={!channel}
      />
      <div className={styles.toolbar}>
        <div>
          <Tooltip
            content="Attach Files"
            positioning="above"
            relationship="label"
          >
            <Button
              icon={<SendIcon />}
              appearance="subtle"
              disabled={!channel}
            />
          </Tooltip>
        </div>
        <div>
          <Tooltip content="Send" positioning="above" relationship="label">
            <Button
              icon={<SendIcon />}
              appearance="subtle"
              onClick={handleSend}
              disabled={!channel || !content.trim()}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
