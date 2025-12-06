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
import Login from "./routes/login";
import Servers from "./routes/servers";

const Root = () => {
  // Initialize theme based on system preference
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? webDarkTheme
      : webLightTheme
  );

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
      <StoatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<App />} />
              <Route path="servers" element={<Servers />} />
              <Route path="server/:id" element={<Servers />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </StoatProvider>
    </FluentProvider>
  );
};

createRoot(document.getElementById("app")!).render(<Root />);
