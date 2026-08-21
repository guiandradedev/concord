import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useTranslation } from "react-i18next"
import type { UseFormReturn } from "react-hook-form"
import type { SignUpFormInputs } from "./signup"

export function SignupForm({
  className,
  onSubmit,
  form,
  ...props
}: React.ComponentProps<"form"> & {
  onSubmit: React.FormEventHandler<HTMLFormElement>
  form: UseFormReturn<SignUpFormInputs>
}) {
  const [t] = useTranslation('public')
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t('register.title')}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t('register.description')}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">{t('register.name.label')}</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder={t('register.name.placeholder')}
            required
            className="bg-background"
            {...form.register("name")}
          />
        </Field>
        {form.formState.errors.name && (
          <FieldDescription className="text-red-500">
            {form.formState.errors.name.message}
          </FieldDescription>
        )}
        <Field>
          <FieldLabel htmlFor="email">{t('register.email.label')}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t('register.email.placeholder')}
            required
            className="bg-background"
            {...form.register("email")}
          />
        </Field>
        {form.formState.errors.email && (
          <FieldDescription className="text-red-500">
            {form.formState.errors.email.message}
          </FieldDescription>
        )}
        <Field>
          <FieldLabel htmlFor="password">{t('register.password.label')}</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder={t('register.password.placeholder')}
            required
            className="bg-background"
            {...form.register("password")}
          />
        </Field>
        {form.formState.errors.password && (
          <FieldDescription className="text-red-500">
            {form.formState.errors.password.message}
          </FieldDescription>
        )}
        <Field>
          <FieldLabel htmlFor="confirm-password">{t('register.password.confirmPassword.label')}</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder={t('register.password.confirmPassword.placeholder')}
            required
            className="bg-background"
            {...form.register("confirmPassword")}
          />
        </Field>
        {form.formState.errors.confirmPassword && (
          <FieldDescription className="text-red-500">
            {form.formState.errors.confirmPassword.message}
          </FieldDescription>
        )}
        <Field>
          <Button type="submit">{t('register.createAccountButton')}</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            {t('register.alreadyHaveAccount')} <a href="/login">{t('register.signInLink')}</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
