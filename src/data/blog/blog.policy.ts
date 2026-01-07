import 'server-only'
import { FullUserDTO, PartialUserDTO } from '../user/user.dto';
import { ArticlePostDTO } from './blog.dto';

export function canCreateArticle(user: FullUserDTO | null) {
    return Boolean(user)
}

export function canEditArticle(user: PartialUserDTO | null, post: ArticlePostDTO) {
    if (!user) return false;

    if (post.authorId && post.authorId === user.id) return true;
    return false;
}