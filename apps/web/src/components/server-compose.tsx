import {
  Button,
  Divider,
  Input,
  makeStyles,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { AttachIcon, EmojiIcon, SendIcon } from "../utils/icons";
import { Channel } from "stoat.js";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "./emoji-picker";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    padding: tokens.spacingVerticalSNudge,
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

// Fixed timout values
const TYPING_TIMEOUT = 3000;
const TYPING_SEND_INTERVAL = 4000;

export default function ServerCompose({ channel }: { channel?: Channel }) {
  const styles = useStyles();
  const [content, setContent] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentRef = useRef<number>(0);
  const isTypingRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (channel && isTypingRef.current) {
        channel.stopTyping();
        isTypingRef.current = false;
      }
    };
  }, [channel]);

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (channel && isTypingRef.current) {
      channel.stopTyping();
      isTypingRef.current = false;
    }
  };

  const handleTyping = () => {
    if (!channel) return;

    const now = Date.now();

    if (now - lastTypingSentRef.current > TYPING_SEND_INTERVAL) {
      channel.startTyping();
      lastTypingSentRef.current = now;
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, TYPING_TIMEOUT);
  };

  const handleSend = async () => {
    if (!channel || !content.trim()) return;
    stopTyping();
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

  const handleChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    data: { value: string },
  ) => {
    setContent(data.value);
    if (data.value.trim()) {
      handleTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <div className={styles.root}>
      <Input
        size="large"
        className={styles.input}
        placeholder={`Message ${channel?.name ? "#" + channel.name : ""}`}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!channel}
        contentAfter={
          <div className={styles.toolbar}>
            <Popover positioning="above-start">
              <PopoverTrigger disableButtonEnhancement>
                <Tooltip
                  content="Open Emoji/Gif Picker"
                  positioning="above"
                  relationship="label"
                >
                  <Button
                    icon={<EmojiIcon />}
                    appearance="subtle"
                    disabled={!channel}
                  />
                </Tooltip>
              </PopoverTrigger>
              <PopoverSurface>
                <EmojiPicker />
              </PopoverSurface>
            </Popover>
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
