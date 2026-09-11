import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { SignupForm } from "./signup-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAuth } from "~/contexts/AuthContext";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Tipagem do formulário
const getSignupSchema = (t: (key: string, options?: any) => string) =>
  z.object({
    name: z
      .string()
      .nonempty(t("register.name.error_name_required")),
    email: z
      .string()
      .email(t("register.email.error_email_invalid"))
      .nonempty(t("register.email.error_email_required")),
    password: z
      .string()
      .nonempty(t("register.password.error_password_required"))
      .min(6, t("register.password.error_password_min_length")),
    confirmPassword: z
      .string()
      .nonempty(t("register.password.confirmPassword.error_confirmPassword_required"))
  });
export type SignUpFormInputs = z.infer<ReturnType<typeof getSignupSchema>>;

export default function SignupScreen() {
  const { t } = useTranslation(['public', 'common'])
  const { register } = useAuth();
  const navigate = useNavigate();

  // Salva o schema para não recriar toda vez que muda a linguagem
  const signupSchema = useMemo(() => getSignupSchema(t), [t]);

  const form: UseFormReturn<SignUpFormInputs> = useForm<SignUpFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: t("register.password.confirmPassword.error_confirmPassword_mismatch"),
      });
      return;
    }
    try {
      await register(data.name, data.email, data.password);
      navigate("/app");
    } catch (error: any) {
      if (error.message === "EMAIL_EXISTS") {
        form.setError("email", {
          type: "manual",
          message: t("register.email.error_email_already_exists"),
        });
        toast.error(t("register.email.error_email_already_exists"));
      } else {
        toast.error(t("register.error_generic"));
      }
    }
  });
  return (
    <div className="min-h-svh bg-background px-6 py-7 md:px-10 md:py-9">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageCircle aria-hidden="true" className="size-5" />
          </span>
          {t('common:title')}
        </Link>
        <Link to="/login" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          {t('register.signInLink')}
        </Link>
      </header>
      <div className="mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-lg items-center justify-center py-12">
        <div className="w-full rounded-3xl border border-border/80 bg-card p-6 shadow-[0_20px_60px_oklch(0.2_0.03_265/0.06)] sm:p-9">
          <SignupForm form={form} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
