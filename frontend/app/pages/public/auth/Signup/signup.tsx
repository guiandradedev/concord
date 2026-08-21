import { GalleryVerticalEndIcon } from "lucide-react";
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            {t('common:title')}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm form={form} onSubmit={handleSubmit} />
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