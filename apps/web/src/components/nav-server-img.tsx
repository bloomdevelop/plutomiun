import { Skeleton, makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  image: {
    width: "32px",
    height: "32px",
    borderRadius: tokens.borderRadiusMedium,
  },
});

export default function NavServerImg({ url }: { url?: string }) {
  const styles = useStyles();
  return url ? (
    <img src={url} className={styles.image} />
  ) : (
    <Skeleton className={styles.image} />
  );
}
