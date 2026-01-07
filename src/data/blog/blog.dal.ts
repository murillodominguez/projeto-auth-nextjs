import { getCurrentUser } from '@/auth/current-user';
import { prisma } from '../prisma'
import {
    ArticleCreateInput,
    ArticleCreateInputSchema,
    ArticlePostSchema,
    ArticlePostDTO,
} from './blog.dto'
import { 
    canCreateArticle,
    canEditArticle
 } from './blog.policy';
import { requireUser } from '@/auth/require-user';

export class BlogDAL {
    private constructor(private readonly userId: number | string) {}

    static async create() {
        const user = await requireUser()
        return new BlogDAL(user.id);
    }

    static async public() {
        const user = await getCurrentUser({})
        return new BlogDAL(user?.id ?? "");
    }

    async listArticles(): Promise<ArticlePostDTO[]> {
        const rows = await prisma.article.findMany({
            orderBy: { createdAt: "desc" }
        })

        return rows.map((r) => ({
            id: r.id,
            title: r.title,
            content: r.content,
            imageUrl: r.imageUrl,
            authorId: r.authorId,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        }))
    }

    async createArticle(input: ArticleCreateInput): Promise<ArticlePostDTO> {
        const parsed = ArticleCreateInputSchema.safeParse(input)
        if (!parsed.success) {
            const message = parsed.error.issues
                .map((i) => `${i.path.join(".")}: ${i.message}`)
                .join(", ");
            throw new Error(`ValidationError: ${message}`)
        }
        
        const user = await requireUser();
        if (!canCreateArticle(user)) throw new Error("Forbidden: cannot create article")

        const created = await prisma.article.create({
            data: {
                title: parsed.data.title,
                content: parsed.data.content,
                imageUrl: parsed.data.imageUrl,
                authorId: user.id
            }
        })

        return {
            id: created.id,
            title: created.title,
            content: created.content,
            imageUrl: created.imageUrl,
            authorId: created.authorId,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt
        }
    }
}