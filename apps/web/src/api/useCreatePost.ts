import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '../lib/orpc';

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orpc.posts.createPost.mutate,
    onSuccess: () => {
      // Invalidate the posts list query to refetch
      queryClient.invalidateQueries({ queryKey: orpc.posts.listPosts.queryOptions().queryKey });
    },
  });
}