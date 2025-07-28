import { useQuery } from '@tanstack/react-query';
import { orpc } from '../lib/orpc';

export function useGetPost(id: string) {
  return useQuery(orpc.posts.getPost.queryOptions({ id }));
}