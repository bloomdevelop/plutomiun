import { HTMLAttributes, Suspense, useEffect, useState } from "react";
import { Channel, Message } from "stoat.js";
import {
  Body1,
  Button,
  makeStyles,
  mergeClasses,
  Spinner,
  Title3,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { MessageList } from "./message";
import ServerCompose from "./server-compose";
import { CallIcon } from "../utils/icons";

const useStyles = makeStyles({
  defaultView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  messagesView: {
    display: "flex",
    flexDirection: "column",
    paddingInline: tokens.spacingHorizontalXXXL,
    overflowY: "scroll",
    overflowX: "unset",
    flex: "1",
  },
  header: {
    paddingTop: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalL,
    paddingBottom: tokens.spacingVerticalM,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid",
    borderBottomColor: tokens.colorNeutralStroke1,
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  channelView: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
});

export default function ServerChannelView({
  className,
  channel,
}: {
  className?: HTMLAttributes<HTMLDivElement>["className"];
  channel?: Channel;
}) {
  const styles = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!channel) return;

    const fetchMessages = async () => {
      try {
        const { messages: fetchedMessages } =
          await channel.fetchMessagesWithUsers();
        setMessages(fetchedMessages.reverse());
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [channel]);

  if (!channel) {
    return (
      <div className={mergeClasses(styles.defaultView, className)}>
        <Body1>Select a channel to view messages</Body1>
      </div>
    );
  }

  return (
    <div className={mergeClasses(styles.channelView, className)}>
      <div className={styles.header}>
        <Title3>{channel.name} </Title3>
        <div>
          {channel.isVoice ? (
            <Tooltip content="Call (Not implemented)" relationship="label">
              <Button
                disabledFocusable={true}
                appearance="subtle"
                icon={<CallIcon />}
              />
            </Tooltip>
          ) : null}
        </div>
      </div>
      <div className={styles.messagesView}>
        <Suspense
          fallback={
            <div className={styles.loading}>
              <Spinner size="extra-large" />
            </div>
          }
        >
          <MessageList messages={messages} />
        </Suspense>
      </div>
      <ServerCompose channel={channel} />
    </div>
  );
}
