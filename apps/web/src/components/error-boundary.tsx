import { Body1 } from "@fluentui/react-components";

export default function ErrorFallback({ error }: { error: Error }) {
  return (
    <div>
      <Body1>Something went wrong:</Body1>
      <Body1>{error.message}</Body1>
    </div>
  );
}
