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
    <form className={cn("flex flex-col gap-7", className)} {...props} onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col gap-2 text-left">
          <p className="text-sm font-medium text-primary">Welcome back</p>
          <h1 className="text-3xl font-semibold tracking-tight">{t('login.title')}</h1>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">{t('login.description')}</p>
        </div>
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">{t("login.email.label", "Email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("login.email.placeholder", "exemplo@email.com")}
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!form.formState.errors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("login.password.label")}</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("login.password.forgotPassword")}
            </a>
          </div>
          <Input id="password" type="password" aria-invalid={!!form.formState.errors.password} {...form.register("password")} />
          {form.formState.errors.password && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button className="h-11 w-full" type="submit">{t("login.signInButton")}</Button>
        </Field>
        <Field>
          <FieldDescription className="text-left">
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
