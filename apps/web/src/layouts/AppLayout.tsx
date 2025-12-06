import { makeStyles, tokens } from "@fluentui/react-components";
import { Outlet } from "react-router";
import AppNavigation from "../components/app-navigation";
import AppHeader from "../components/app-header";

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground4,
  },

  col: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
  },
  content: {
    flex: "1",
    overflow: "hidden",
  },
});

export default function AppLayout() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <AppNavigation />
      <div className={styles.col}>
        <AppHeader />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
