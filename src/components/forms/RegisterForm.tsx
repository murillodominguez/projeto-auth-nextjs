"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateArticleFormSchema, CreateArticleFormData } from "@/schemas/blog";
import { createArticleAction, signUp } from "@/app/actions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "../ui/button";

import { Field, FieldGroup, FieldLabel, FieldError } from "../ui/field";

import { Input } from "../ui/input";
import { 
    SignUpSchema,
    SignUpData,
} from "@/schemas/auth";
import { ErrorAlert } from "../ui/custom-alert";

export default function RegisterForm() {
  const {
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors } 
  } = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: SignUpData) {
    const response = await signUp(data);
    if (!response.ok) {
      setError("root", {message: response.error})
    }
  }

  return (
    <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Sign Up</CardTitle>
      <CardDescription>Create your account to start posting!</CardDescription>
      {errors.root && <ErrorAlert>{errors.root.message}</ErrorAlert>}
    </CardHeader>
    <CardContent>
    <form onSubmit={handleSubmit(onSubmit)} id="register-form">
      <FieldGroup>

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) =>
            (<Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-name">
                Username:
              </FieldLabel>
              <Input
                {...field}
                id="register-name"
                aria-invalid={fieldState.invalid}
                placeholder="ex: World Eater"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) =>
            (<Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-email">
                Email:
              </FieldLabel>
              <Input
                {...field}
                id="register-email"
                aria-invalid={fieldState.invalid}
                placeholder="ex: patapim@gmail.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-password">
                Senha:
              </FieldLabel>
              <Input
                {...field}
                type="password"
                id="register-password"
                aria-invalid={fieldState.invalid}
                placeholder="Digite sua senha"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
    </CardContent>
    <CardFooter>
      <Button className="cursor-pointer" disabled={isSubmitting} type="submit" form="register-form">Submit</Button>
    </CardFooter>
    </Card>
  );
}
