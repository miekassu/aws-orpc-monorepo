import { implement } from '@orpc/server';
import { contracts } from '@repo/shared-contracts';
import { postsRouter } from './procedures/posts';

const mainBase = implement(contracts);

// Main router with posts mounted under /posts
export const mainRouter = mainBase.router({
  posts: postsRouter,
});