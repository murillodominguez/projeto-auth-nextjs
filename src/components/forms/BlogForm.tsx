"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateArticleFormSchema, CreateArticleFormData } from "@/schemas/blog";
import { createArticleAction } from "@/app/actions";
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

export default function BlogForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isLoading } 
  } = useForm<CreateArticleFormData>({
    resolver: zodResolver(CreateArticleFormSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: CreateArticleFormData) {
    await createArticleAction(data);
  }

  return (
    <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Poste um Artigo</CardTitle>
      <CardDescription>Seu artigo colore a nossa página.</CardDescription>
    </CardHeader>

    <CardContent>
    <form onSubmit={handleSubmit(onSubmit)} id="article-form">
      <FieldGroup>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) =>
            (<Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="article-title">Título do Artigo</FieldLabel>
              <Input
                {...field}
                id="article-title"
                aria-invalid={fieldState.invalid}
                placeholder="Título do artigo"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="article-content">
                Conteúdo
              </FieldLabel>
              <Input
                {...field}
                id="article-content"
                aria-invalid={fieldState.invalid}
                placeholder="Conteúdo do artigo"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="imageUrl"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="article-image">URL da Imagem</FieldLabel>
              <Input
                {...field}
                id="article-image"
                aria-invalid={fieldState.invalid}
                placeholder="https://imgur.com"
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
      <Button className="cursor-pointer" disabled={isSubmitting} type="submit" form="article-form">Submit</Button>
    </CardFooter>
    </Card>
  );
}
