import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import type { UseFormReturn } from "react-hook-form"
import type { SignInFormInputs } from "./login"
import { useTranslation } from "react-i18next"

export function LoginForm({
  className,
  onSubmit,
  form,
  ...props
}: React.ComponentProps<"form"> & {
  onSubmit: React.FormEventHandler<HTMLFormElement>
  form: UseFormReturn<SignInFormInputs>
}) {
  const { t } = useTranslation("public")
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t('login.title')}</h1>
          <p className="text-sm text-balance text-muted-foreground">{t('login.description')}</p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">{t("login.email.label", "Email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("login.email.placeholder", "exemplo@email.com")}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <FieldDescription className="text-red-500">
              {form.formState.errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("login.password.label")}</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("login.password.forgotPassword")}
            </a>
          </div>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <FieldDescription className="text-red-500">
              {form.formState.errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button type="submit">{t("login.signInButton")}</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            {t("login.signUp.text")} {" "}
            <a href="/signup" className="underline underline-offset-4">
              {t("login.signUp.link")}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
