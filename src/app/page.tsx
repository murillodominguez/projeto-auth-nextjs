import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BlogForm from "@/components/forms/BlogForm";
import { getCurrentUser } from "@/auth/current-user";
import ArticleList from "@/components/ArticleList";
import { BlogDAL } from "@/data/blog/blog.dal";

async function getArticles() {
  const blog = ((await BlogDAL.public()).listArticles())
  return blog
}

export default async function Home() {
  const articles = await getArticles()

  return (
    <div className="w-full flex flex-col items-center justify-center">  
      <BlogForm />
      <ArticleList articles={articles}/>
    </div>
  );
}
