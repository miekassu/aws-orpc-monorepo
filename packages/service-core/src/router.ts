import { implement } from '@orpc/server';
import { contracts } from '@repo/shared-contracts';
import type { InferContractRouterOutputs } from '@orpc/contract';
import { createPostsRouter } from './procedures/posts';

type PostsOutputs = InferContractRouterOutputs<typeof contracts.posts>;
type Post = PostsOutputs['getPost'];

export function createMainRouter(database: { posts: Post[] }) {
  const mainBase = implement(contracts);
  
  // Main router with posts mounted under /posts
  return mainBase.router({
    posts: createPostsRouter(database),
  });
}