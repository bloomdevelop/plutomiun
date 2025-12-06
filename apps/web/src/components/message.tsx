import {
  Avatar,
  Body1,
  Caption1,
  Divider,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import type { Message } from "stoat.js";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./error-boundary";
import { Fragment, useMemo } from "react";
import convertPresence from "../utils/convert-presence";
import { useStoat } from "../contexts/stoat";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    gap: tokens.spacingHorizontalM,
    paddingBottom: 0,
    alignItems: "center",
    "&:hover .timestamp": {
      opacity: 1,
    },
  },
  rootTail: {
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: 0,
  },
  content: {
    background: tokens.colorNeutralBackground3,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    maxWidth: "100%",
    width: "fit-content",
    wordBreak: "break-word",
  },
  contentHeader: {
    display: "flex",
    flexDirection: "row",
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalM,
    marginLeft: "48px",
  },
  tailPlaceholder: {
    width: "36px",
  },
  messageCol: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  divider: {
    paddingBlock: tokens.spacingVerticalL,
  },
  rootSelf: {
    flexDirection: "row-reverse",
  },
  rootSelfNoTail: {
    marginTop: tokens.spacingVerticalM,
  },
  contentSelf: {
    background: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  time: {
    color: tokens.colorNeutralForeground3,
    opacity: 0,
    transition: "opacity 0.2s ease-in-out",
  },
});

interface MessageComponentProps {
  message: Message;
  tail?: boolean;
}

export function MessageComponent({ message, tail }: MessageComponentProps) {
  const styles = useStyles();
  const { user } = useStoat();
  const isSelf = user?.id === message.authorId;

  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <div className={styles.messageCol}>
        {!isSelf && !tail && (
          <div className={styles.contentHeader}>
            <Body1>{message.author?.displayName}</Body1>
          </div>
        )}

        <div
          className={mergeClasses(
            styles.root,
            tail && styles.rootTail,
            isSelf && styles.rootSelf,
            isSelf && !tail && styles.rootSelfNoTail
          )}
        >
          {!isSelf &&
            (tail ? (
              <div className={styles.tailPlaceholder} />
            ) : (
              <Avatar
                name={
                  message.author?.displayName ||
                  message.author?.username ||
                  "Unknown"
                }
                badge={{
                  status: convertPresence(message.author),
                }}
                size={36}
                image={{
                  src: message.author?.avatarURL || "",
                }}
                color="colorful"
              />
            ))}
          <div
            className={mergeClasses(
              styles.content,
              isSelf && styles.contentSelf
            )}
          >
            {/* TODO: Implement Markdown */}
            <Body1>{message.content}</Body1>
          </div>
          <Caption1
            className={mergeClasses(styles.time, "timestamp")}
            title={message.createdAt.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          >
            {message.createdAt.toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Caption1>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default MessageComponent;

export function MessageList({ messages }: { messages: Message[] }) {
  const styles = useStyles();
  const elements = useMemo(() => {
    // Algorithm expects L to be newest to oldest.
    // If input 'messages' is oldest to newest (standard chat log), we should reverse it first?
    // The user said: "Let L be the list of messages ordered from newest to oldest"
    // And "This algorithm expects that the rendering of the output list is reversed, if you need it from oldest to newest: either reverse at the end or adapt the logic."
    // If I assume 'messages' prop passed to MessageList is oldest-to-newest (standard), then L = [...messages].reverse().
    // But let's assume 'messages' passed in is already what the user has (which is oldest-to-newest in ServerChannelView).
    // So I should reverse it to get L.

    const L = [...messages].reverse();
    const E: React.ReactNode[] = [];

    for (let i = 0; i < L.length; i++) {
      const M = L[i];
      let tail = true;
      let date: Date | null = null;
      const next = L[i + 1] || null;

      if (next) {
        const adate = M.createdAt;
        const bdate = next.createdAt;

        if (
          adate.getDate() !== bdate.getDate() ||
          adate.getMonth() !== bdate.getMonth() ||
          adate.getFullYear() !== bdate.getFullYear()
        ) {
          date = adate;
        }

        const diffMs = adate.getTime() - bdate.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        // Check masquerade equality (simple object comparison or name comparison)
        const masqueradeMatch =
          M.masquerade === next.masquerade ||
          (M.masquerade?.name === next.masquerade?.name &&
            M.masquerade?.avatar === next.masquerade?.avatar);

        if (
          M.authorId !== next.authorId ||
          diffMinutes >= 7 ||
          !masqueradeMatch ||
          M.systemMessage ||
          next.systemMessage ||
          (M.replyIds && M.replyIds.length > 0)
        ) {
          tail = false;
        }
      } else {
        tail = false;
      }

      E.push(
        <MessageComponent key={`${M.id}:${tail}`} message={M} tail={tail} />
      );

      if (date) {
        E.push(
          <Divider
            className={styles.divider}
            appearance="subtle"
            key={`date-${date.getTime()}`}
          >
            {date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Divider>
        );
      }
    }

    // The algorithm produces E (newest to oldest).
    // We want to render oldest to newest.
    return E.reverse();
  }, [messages]);

  return <Fragment>{elements}</Fragment>;
}
