import { SubmitHandler, useForm } from "react-hook-form";
import { useStoat } from "../contexts/stoat";
import {
  Button,
  Field,
  Input,
  makeStyles,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import { useNavigate } from "react-router";

type LoginInputs = {
  email: string;
  password: string;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    background: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusLarge,
    minWidth: "300px",
  },
});

export default function Login() {
  const { client } = useStoat();
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    console.log(data);
    try {
      await client.login({
        email: data.email,
        password: data.password,
      });
      client.connect();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="Email"
          required
          validationState={errors.email ? "error" : "none"}
          validationMessage={errors.email?.message}
        >
          <Input {...register("email")} type="email" />
        </Field>
        <Field
          label="Password"
          required
          validationState={errors.password ? "error" : "none"}
          validationMessage={errors.password?.message}
        >
          <Input {...register("password")} type="password" />
        </Field>
        <Button
          type="submit"
          disabledFocusable={isSubmitting}
          icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
