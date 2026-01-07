import { z } from 'zod';

export const ArticleCreateInputSchema = z.object({
    title: z.string().min(2).max(50),
    content: z.string().min(2).max(600),
    imageUrl: z.string().min(2).max(500),
})

export type ArticleCreateInput = z.infer<typeof ArticleCreateInputSchema>

export const ArticlePostSchema = z.object({
    id: z.int().min(1),
    title: z.string().min(2).max(50),
    content: z.string().min(2).max(600),
    imageUrl: z.string().min(2).max(500),
    authorId: z.int().min(1),
    createdAt: z.date(),
    updatedAt: z.date()
})

export type ArticlePostDTO = z.infer<typeof ArticlePostSchema>