"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateArticleFormSchema, CreateArticleFormData } from "@/schemas/blog";
import { createArticleAction, signIn } from "@/app/actions";
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
    SignInSchema,
    SignInData,
} from "@/schemas/auth";
import { useActionState } from "react";
import { ErrorAlert, SuccessAlert } from "../ui/custom-alert";

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors } 
  } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: SignInData) {
    const response = await signIn(data);
    if (!response.ok) {
      setError("root", {message: response.error})
    }
  }

  return (
    <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Sign In</CardTitle>
      <CardDescription>Welcome back!</CardDescription>
      {errors.root && <ErrorAlert>{errors.root.message}</ErrorAlert>}
    </CardHeader>
    <CardContent>
    <form onSubmit={handleSubmit(onSubmit)} id="login-form">
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) =>
            (<Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">
                Email:
              </FieldLabel>
              <Input
                {...field}
                id="login-email"
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
              <FieldLabel htmlFor="login-password">
                Senha:
              </FieldLabel>
              <Input
                {...field}
                type="password"
                id="login-password"
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
      <Button className="cursor-pointer" disabled={isSubmitting} type="submit" form="login-form">Submit</Button>
    </CardFooter>
    </Card>
  );
}
