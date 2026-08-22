import { GalleryVerticalEndIcon } from "lucide-react";
import { LoginForm } from "./login-form";
import { useAuth } from "~/contexts/AuthContext";
import { z } from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useMemo } from "react";

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
    await login(data.email, data.password);
    navigate("/app");
  });

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            {t("common:title")}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={handleSubmit} form={form} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  )
}