import {
  Avatar,
  makeStyles,
  mergeClasses,
  shorthands,
  Title3,
  tokens,
} from "@fluentui/react-components";
import { useStoat } from "../contexts/stoat";
import { useEffect, useState } from "react";
import { Channel, Server } from "stoat.js";
import ServerChannelView from "../components/channel-view";
import { CallIcon, ChatMultipleIcon } from "../utils/icons";
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
    minWidth: "250px",
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
  accordionPanel: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  serverList: {
    display: "flex",
    flexDirection: "column",
  },
  serverItem: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    "&:nth-child(n+2)": {
      ...shorthands.margin(tokens.spacingVerticalMNudge, 0, 0, 0),
      "&::before": {
        content: "''",
        position: "absolute",
        display: "block",
        left: tokens.spacingHorizontalM,
        right: tokens.spacingHorizontalM,
        top: "-5px",
        height: "1px",
        ...shorthands.borderTop(
          "0.1rem",
          "solid",
          tokens.colorNeutralStrokeAlpha
        ),
      },
    },
  },
  serverItemMain: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusXLarge,
    background: "transparent",
    height: "68px",
    color: tokens.colorNeutralForeground1,
    ...shorthands.margin(tokens.spacingVerticalXXS, tokens.spacingHorizontalM),
    ...shorthands.border("1px", "solid", "transparent"),
    ":hover": {
      background: tokens.colorNeutralBackground3Hover,
    },
  },
  serverItemChannel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusXLarge,
    background: "transparent",
    height: "40px",
    border: "none",
    color: tokens.colorNeutralForeground1,
    ...shorthands.margin(tokens.spacingVerticalXXS, tokens.spacingHorizontalM),
    ":hover": {
      background: tokens.colorNeutralBackground3Hover,
    },
  },
  serverItemChannelSelected: {
    [`& .${iconFilledClassName}`]: {
      display: "block",
    },
    [`& .${iconRegularClassName}`]: {
      display: "none",
    },
    background: tokens.colorNeutralBackground2Selected,
  },
  channelView: {
    flex: "1",
  },
});

export default function Servers() {
  const styles = useStyles();
  const { client } = useStoat();

  const [servers, setServers] = useState<Map<string, Server>>(new Map());

  useEffect(() => {
    // Function to sync servers from the SDK to React state
    const syncServers = () => {
      const serverMap = new Map<string, Server>();
      client.servers.forEach((server) => {
        serverMap.set(server.id, server);
      });
      setServers(serverMap);
    };

    // Sync servers when the component mounts
    syncServers();

    // Listen to SDK events to know when servers change
    const onReady = () => syncServers();
    const onServerCreate = () => syncServers();
    const onServerDelete = () => syncServers();

    client.on("ready", onReady);
    client.on("serverCreate", onServerCreate);
    client.on("serverDelete", onServerDelete);

    // Cleanup event listeners
    return () => {
      client.off("ready", onReady);
      client.off("serverCreate", onServerCreate);
      client.off("serverDelete", onServerDelete);
    };
  }, [client]);

  const [_, setServer] = useState<Server | undefined>(undefined);
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>(
    undefined
  );

  const onChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    if (channel.serverId) {
      const parentServer = servers.get(channel.serverId);
      if (parentServer) {
        setServer(parentServer);
      }
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <Title3>Servers</Title3>
        </div>
        <div className={styles.serverList}>
          {Array.from(servers.entries()).map(([id, server]) => (
            <div key={id} className={styles.serverItem}>
              <div className={styles.serverItemMain}>
                <Avatar
                  name={server.name}
                  color="colorful"
                  shape="square"
                  size={40}
                  image={{
                    src: server.iconURL || "",
                  }}
                />
                {server.name}
              </div>
              {server?.channels?.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  className={mergeClasses(
                    styles.serverItemChannel,
                    selectedChannel?.id === channel.id
                      ? styles.serverItemChannelSelected
                      : ""
                  )}
                >
                  {channel.isVoice ? <CallIcon /> : <ChatMultipleIcon />}
                  {channel.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <ServerChannelView
          channel={selectedChannel}
          className={styles.channelView}
        />
      </div>
    </div>
  );
}
