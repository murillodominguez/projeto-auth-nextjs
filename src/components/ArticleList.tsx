import { BlogDAL } from "@/data/blog/blog.dal";
import { Article } from "../../generated/prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { getCurrentUser } from "@/auth/current-user";
import { UserDAL } from "@/data/user/user.dal";

export default async function ArticleList({articles}: {articles: Article[]}) {
    return (
        <section>
            <h1>Articles</h1>
            {articles.length == 0 ? (
                <p>
                    No articles to display yet. Come back later, or write your own!
                </p>
            ) : (
                <div className="flex flex-wrap justify-center gap-3">
                    {articles.map(async (a) => (
                        <Card
                            key={a.id}
                            className="w-50"
                        >
                            <div>
                                <img
                                    src={a.imageUrl}
                                    alt={a.title}
                                    loading="lazy"
                                    className=""
                                />
                            </div>
                        <CardHeader>
                            <CardTitle className="truncate">{a.title}</CardTitle>
                            <CardDescription>
                                {a.content.length > 140 ? a.content.slice(0,140) + "..." : a.content}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                {new Date(a.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">{await UserDAL.create().getUserNameById(a.authorId) ?? "Autor indefinido"}</p>
                        </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    )
}