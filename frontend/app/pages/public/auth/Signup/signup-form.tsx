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
    <form className={cn("flex flex-col gap-7", className)} {...props} onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col gap-2 text-left">
          <p className="text-sm font-medium text-primary">A clearer way to connect</p>
          <h1 className="text-3xl font-semibold tracking-tight">{t('register.title')}</h1>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            {t('register.description')}
          </p>
        </div>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">{t('register.name.label')}</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder={t('register.name.placeholder')}
            required
            aria-invalid={!!form.formState.errors.name}
            className="bg-background"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <FieldDescription className="text-destructive">
            {form.formState.errors.name.message}
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">{t('register.email.label')}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t('register.email.placeholder')}
            required
            aria-invalid={!!form.formState.errors.email}
            className="bg-background"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <FieldDescription className="text-destructive">
            {form.formState.errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="password">{t('register.password.label')}</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder={t('register.password.placeholder')}
            required
            aria-invalid={!!form.formState.errors.password}
            className="bg-background"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <FieldDescription className="text-destructive">
            {form.formState.errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!form.formState.errors.confirmPassword}>
          <FieldLabel htmlFor="confirm-password">{t('register.password.confirmPassword.label')}</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder={t('register.password.confirmPassword.placeholder')}
            required
            aria-invalid={!!form.formState.errors.confirmPassword}
            className="bg-background"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <FieldDescription className="text-destructive">
            {form.formState.errors.confirmPassword.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button className="h-11 w-full" type="submit">{t('register.createAccountButton')}</Button>
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
