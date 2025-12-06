import { PresenceBadgeStatus } from "@fluentui/react-components";
import { User } from "stoat.js";



export default function convertPresence(user?: User): PresenceBadgeStatus {
    if (!user) return "unknown";
    switch (user.presence) {
        case "Online":
            return "available";
        case "Idle":
            return "away";
        case "Busy":
            return "do-not-disturb";
        case "Focus":
            return "busy";
        case "Invisible":
            return "offline";
        default:
            return "unknown";
    }
}