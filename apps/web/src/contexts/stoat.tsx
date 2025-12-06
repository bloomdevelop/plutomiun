import { Client, User } from "stoat.js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AccountCollection } from "../../../../packages/javascript-client-sdk/lib/collections/AccountCollection";

interface StoatContextType {
  client: Client;
  user?: User;
  account?: AccountCollection;
}

const StoatContext = createContext<StoatContextType | undefined>(undefined);

export function StoatProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => new Client(), []);
  const [user, setUser] = useState<User | undefined>(client.user);
  const [account, setAccount] = useState<AccountCollection | undefined>(
    client.account
  );

  useEffect(() => {
    const update = () => {
      setUser(client.user);
      setAccount(client.account);
    };
    client.on("ready", update);
    client.on("userUpdate", update);
    client.on("logout", update);

    return () => {
      client.off("ready", update);
      client.off("userUpdate", update);
      client.off("logout", update);
    };
  }, [client]);

  return (
    <StoatContext.Provider value={{ client, user, account }}>
      {children}
    </StoatContext.Provider>
  );
}

export function useStoat() {
  const context = useContext(StoatContext);
  if (context === undefined) {
    throw new Error("useStoat must be used within a StoatProvider");
  }
  return context;
}
