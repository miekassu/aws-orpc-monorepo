import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '../lib/orpc';

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orpc.posts.deletePost.mutate,
    onSuccess: () => {
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: orpc.posts.listPosts.queryOptions().queryKey });
    },
  });
}