import { z } from "zod";

export const CreateArticleFormSchema = z.object({
    title: z.string().min(2, {message: 'deu merda aqui'}).max(50, {message: 'tu fala demais'}),
    content: z.string().min(2, {message: 'ja avisei que vai dar merda isso.'}).max(600, {message: 'ce fala demais ein filho?'}),
    imageUrl: z.string().min(2, {message: 'ta....'}).max(500, {message: 'deu né? Era só uma url!'}),
});

export type CreateArticleFormData = z.infer<typeof CreateArticleFormSchema>