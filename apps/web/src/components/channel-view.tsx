import { HTMLAttributes, Suspense, useEffect, useRef, useState } from "react";
import { Channel, Message, User } from "stoat.js";
import { useStoat } from "../contexts/stoat";
import {
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  Body1,
  Button,
  makeStyles,
  mergeClasses,
  partitionAvatarGroupItems,
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
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    paddingInline: tokens.spacingHorizontalXXXL,
    paddingBlock: tokens.spacingVerticalXS,
    minHeight: "32px",
  },
  typingAvatars: {
    display: "flex",
    alignItems: "center",
  },
  typingText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginLeft: tokens.spacingHorizontalS,
  },
});

function TypingIndicator({
  users,
  className,
}: {
  users: User[];
  className?: string;
}) {
  const styles = useStyles();

  if (users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) return `${users[0].username} is typing...`;
    if (users.length === 2)
      return `${users[0].username} and ${users[1].username} are typing...`;
    return `${users[0].username} and ${users.length - 1} others are typing...`;
  };

  const partitionedItems = partitionAvatarGroupItems({ items: users });

  return (
    <div className={mergeClasses(styles.typingIndicator, className)}>
      <div className={styles.typingAvatars}>
        <AvatarGroup layout="stack" size={24}>
          {partitionedItems.inlineItems.slice(0, 3).map((item) => (
            <AvatarGroupItem
              name={item.displayName || item.username}
              image={{ src: item.avatarURL }}
              key={item.id}
            />
          ))}
          {partitionedItems.overflowItems && (
            <AvatarGroupPopover>
              {partitionedItems.overflowItems.slice(0, 3).map((item) => (
                <AvatarGroupItem
                  name={item.displayName || item.username}
                  image={{ src: item.avatarURL }}
                  key={item.id}
                />
              ))}
            </AvatarGroupPopover>
          )}
        </AvatarGroup>
      </div>
      <span className={styles.typingText}>{getTypingText()}</span>
    </div>
  );
}

export default function ServerChannelView({
  className,
  channel,
}: {
  className?: HTMLAttributes<HTMLDivElement>["className"];
  channel?: Channel;
}) {
  const styles = useStyles();
  const { client } = useStoat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollThreshold = 50;

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom =
      scrollHeight - scrollTop - clientHeight < scrollThreshold;
    setIsScrolledUp(!isNearBottom);
  };

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

    fetchMessages().then(() => {
      scrollToBottom();
    });
  }, [channel]);

  useEffect(() => {
    if (!channel) return;

    const handleMessageCreate = (message: Message) => {
      if (message.channelId !== channel.id) return;
      if (channel.serverId && message.server?.id !== channel.serverId) return;

      setMessages((prev) => [...prev, message]);
    };

    client.on("messageCreate", handleMessageCreate);

    return () => {
      client.off("messageCreate", handleMessageCreate);
    };
  }, [channel, client]);

  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom();
    }
  }, [messages, isScrolledUp]);

  useEffect(() => {
    if (!channel) return;

    const updateTypingUsers = () => {
      const users = channel.typing.filter((user): user is User => !!user);
      setTypingUsers(users);
    };

    updateTypingUsers();

    const handleStartTyping = (typingChannel: Channel, user?: User) => {
      if (typingChannel.id !== channel.id) return;
      if (channel.serverId && typingChannel.serverId !== channel.serverId)
        return;
      if (user) {
        setTypingUsers((prev) => {
          if (prev.some((u) => u.id === user.id)) return prev;
          return [...prev, user];
        });
      }
    };

    const handleStopTyping = (typingChannel: Channel, user?: User) => {
      if (typingChannel.id !== channel.id) return;
      if (user) {
        setTypingUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        setTypingUsers([]);
      }
    };

    client.on("channelStartTyping", handleStartTyping);
    client.on("channelStopTyping", handleStopTyping);

    return () => {
      client.off("channelStartTyping", handleStartTyping);
      client.off("channelStopTyping", handleStopTyping);
    };
  }, [channel, client]);

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
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={styles.messagesView}
      >
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
      <TypingIndicator users={typingUsers} />
      <ServerCompose channel={channel} />
    </div>
  );
}
