import {
  Avatar,
  makeStyles,
  mergeClasses,
  shorthands,
  Title3,
  tokens,
  Body1,
  Spinner,
  Caption1,
} from "@fluentui/react-components";
import { useStoat } from "../contexts/stoat";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Channel, Message, User } from "stoat.js";
import { useParams, useNavigate } from "react-router";
import { MessageList } from "../components/message";
import ServerCompose from "../components/server-compose";
import convertPresence from "../utils/convert-presence";
import { ChatIcon } from "../utils/icons";
import {
  iconFilledClassName,
  iconRegularClassName,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    overflowX: "unset",
    background: tokens.colorNeutralBackground4,
    minWidth: "280px",
    height: "100%",
  },
  header: {
    position: "sticky",
    top: 0,
    padding: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalL,
    background: tokens.colorNeutralBackground4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "61px",
    boxSizing: "border-box",
    zIndex: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    boxShadow: tokens.shadow16,
    borderRadius: tokens.borderRadiusXLarge,
    background: tokens.colorNeutralBackground1,
    zIndex: 1,
    margin: "0 8px 8px 0",
  },
  dmList: {
    display: "flex",
    flexDirection: "column",
  },
  dmItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusXLarge,
    background: "transparent",
    height: "56px",
    border: "none",
    color: tokens.colorNeutralForeground1,
    cursor: "pointer",
    textAlign: "left",
    ...shorthands.margin(tokens.spacingVerticalXXS, tokens.spacingHorizontalM),
    ":hover": {
      background: tokens.colorNeutralBackground3Hover,
    },
  },
  dmItemSelected: {
    [`& .${iconFilledClassName}`]: {
      display: "block",
    },
    [`& .${iconRegularClassName}`]: {
      display: "none",
    },
    background: tokens.colorNeutralBackground2Selected,
  },
  dmInfo: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    overflow: "hidden",
  },
  dmName: {
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dmStatus: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  defaultView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    gap: tokens.spacingVerticalL,
  },
  defaultViewIcon: {
    fontSize: "64px",
    color: tokens.colorNeutralForeground3,
  },
  channelView: {
    display: "flex",
    flexDirection: "column",
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
  chatHeader: {
    paddingTop: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalL,
    paddingBottom: tokens.spacingVerticalM,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    borderBottom: "1px solid",
    borderBottomColor: tokens.colorNeutralStroke1,
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  typingText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginLeft: tokens.spacingHorizontalS,
  },
});

function DMChannelView({
  className,
  channel,
}: {
  className?: string;
  channel?: Channel;
}) {
  const styles = useStyles();
  const { client } = useStoat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollThreshold = 50;

  const recipient = useMemo(() => {
    if (!channel || channel.type !== "DirectMessage") return undefined;
    return channel.recipient;
  }, [channel]);

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

  if (!channel || !recipient) {
    return (
      <div className={mergeClasses(styles.defaultView, className)}>
        <ChatIcon className={styles.defaultViewIcon} />
        <Body1>Select a conversation to start chatting</Body1>
      </div>
    );
  }

  return (
    <div className={mergeClasses(styles.channelView, className)}>
      <div className={styles.chatHeader}>
        <Avatar
          name={recipient.displayName || recipient.username}
          badge={{
            status: convertPresence(recipient),
          }}
          size={40}
          image={{
            src: recipient.avatarURL || "",
          }}
          color="colorful"
        />
        <div>
          <Title3>{recipient.displayName}</Title3>
          <Caption1>{recipient.statusMessage() || recipient.presence}</Caption1>
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
      {typingUsers.length > 0 && (
        <div className={styles.typingIndicator}>
          <span className={styles.typingText}>
            {typingUsers.length === 1
              ? `${typingUsers[0].username} is typing...`
              : `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing...`}
          </span>
        </div>
      )}
      <ServerCompose channel={channel} />
    </div>
  );
}

export default function ChatView() {
  const styles = useStyles();
  const { client } = useStoat();
  const { id } = useParams();
  const navigate = useNavigate();
  const [dmChannels, setDmChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>(
    undefined,
  );

  useEffect(() => {
    const syncDMs = () => {
      const channels = [...client.channels.values()]
        .filter(
          (channel) =>
            channel.type === "DirectMessage" &&
            channel.active &&
            channel.recipient,
        )
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      setDmChannels(channels);
    };

    syncDMs();

    const onReady = () => syncDMs();
    const onChannelCreate = () => syncDMs();
    const onChannelDelete = () => syncDMs();
    const onMessageCreate = () => syncDMs();

    client.on("ready", onReady);
    client.on("channelCreate", onChannelCreate);
    client.on("channelDelete", onChannelDelete);
    client.on("messageCreate", onMessageCreate);

    return () => {
      client.off("ready", onReady);
      client.off("channelCreate", onChannelCreate);
      client.off("channelDelete", onChannelDelete);
      client.off("messageCreate", onMessageCreate);
    };
  }, [client]);

  useEffect(() => {
    if (id) {
      const channel = client.channels.get(id);
      if (channel && channel.type === "DirectMessage") {
        setSelectedChannel(channel);
      }
    } else {
      setSelectedChannel(undefined);
    }
  }, [id, client]);

  const handleChannelSelect = (channel: Channel) => {
    navigate(`/chat/${channel.id}`);
  };

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <Title3>Direct Messages</Title3>
        </div>
        <div className={styles.dmList}>
          {dmChannels.map((channel) => {
            const recipient = channel.recipient;
            if (!recipient) return null;

            return (
              <button
                key={channel.id}
                onClick={() => handleChannelSelect(channel)}
                className={mergeClasses(
                  styles.dmItem,
                  selectedChannel?.id === channel.id
                    ? styles.dmItemSelected
                    : "",
                )}
              >
                <Avatar
                  name={recipient.displayName || recipient.username}
                  badge={{
                    status: convertPresence(recipient),
                  }}
                  size={40}
                  image={{
                    src: recipient.avatarURL || "",
                  }}
                  color="colorful"
                />
                <div className={styles.dmInfo}>
                  <span className={styles.dmName}>{recipient.displayName}</span>
                  <span className={styles.dmStatus}>
                    {recipient.statusMessage() || recipient.presence}
                  </span>
                </div>
              </button>
            );
          })}
          {dmChannels.length === 0 && (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <Caption1>No conversations yet</Caption1>
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <DMChannelView
          channel={selectedChannel}
          className={styles.channelView}
        />
      </div>
    </div>
  );
}
