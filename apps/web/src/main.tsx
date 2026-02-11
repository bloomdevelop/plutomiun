import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { StoatProvider } from "./contexts/stoat";
import "./global.css";
import AppLayout from "./layouts/AppLayout";
import App from "./routes/app";
import ChatView from "./routes/chat";
import Login from "./routes/login";
import Servers from "./routes/servers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Root = () => {
  // Initialize theme based on system preference
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? webDarkTheme
      : webLightTheme,
  );
  const queryClient = new QueryClient();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? webDarkTheme : webLightTheme);
    };

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <FluentProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <StoatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<App />} />
                <Route path="chat" element={<ChatView />} />
                <Route path="chat/:id" element={<ChatView />} />
                <Route path="servers" element={<Servers />} />
                <Route path="server/:id" element={<Servers />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </StoatProvider>
      </QueryClientProvider>
    </FluentProvider>
  );
};

createRoot(document.getElementById("app")!).render(<Root />);
