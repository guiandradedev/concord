import { GalleryVerticalEndIcon } from "lucide-react";
import { LoginForm } from "./login-form";
import { useAuth } from "~/contexts/AuthContext";
import { z } from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const signinSchema = z
  .object({
    email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
    password: z.string().nonempty("Senha é obrigatório"),
  })

export type SignInFormInputs = z.infer<typeof signinSchema>;

export default function LoginScreen() {
  const { t } = useTranslation("common");
  const { login } = useAuth();
  const navigate = useNavigate();
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
            {t("title")}
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