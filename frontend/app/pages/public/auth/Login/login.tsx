import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { LoginForm } from "./login-form";
import { useAuth } from "~/contexts/AuthContext";
import { z } from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";

type LoginErrorResponse = {
  message?: string;
  status?: number;
};

// Tipagem do formulário
const getSigninSchema = (t: (key: string, options?: any) => string) =>
  z.object({
    email: z
      .email(t("login.email.error_email_invalid"))
      .nonempty(t("login.email.error_email_required")),
    password: z
      .string()
      .nonempty(t("login.password.error_password_required")),
  });
export type SignInFormInputs = z.infer<ReturnType<typeof getSigninSchema>>;

export default function LoginScreen() {
  const { t } = useTranslation(["public", "common"]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Salva o schema para não recriar toda vez que muda a linguagem
  const signinSchema = useMemo(() => getSigninSchema(t), [t]);

  const form: UseFormReturn<SignInFormInputs> = useForm<SignInFormInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/app");
    } catch (error) {
      if (axios.isAxiosError<LoginErrorResponse>(error)) {
        const status = error.response?.status ?? error.response?.data?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          toast.error(message ?? t("login.invalidCredentials", "Invalid credentials"));
          return;
        }

        toast.error(message ?? t("login.error_generic", "Unable to sign in. Please try again."));
        return;
      }

      toast.error(t("login.error_generic", "Unable to sign in. Please try again."));
    }
  });

  return (
    <div className="min-h-svh bg-background px-6 py-7 md:px-10 md:py-9">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageCircle aria-hidden="true" className="size-5" />
          </span>
          {t("common:title")}
        </Link>
        <Link to="/signup" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          {t("login.signUp.link")}
        </Link>
      </header>
      <div className="mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-md items-center justify-center py-12">
        <div className="w-full rounded-3xl border border-border/80 bg-card p-6 shadow-[0_20px_60px_oklch(0.2_0.03_265/0.06)] sm:p-9">
          <LoginForm onSubmit={handleSubmit} form={form} />
        </div>
      </div>
    </div>
  )
}
