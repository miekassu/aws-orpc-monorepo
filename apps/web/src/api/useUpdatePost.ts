import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '../lib/orpc';

export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orpc.posts.updatePost.mutate,
    onSuccess: (data) => {
      // Invalidate specific post query
      queryClient.invalidateQueries({ queryKey: orpc.posts.getPost.queryOptions({ id: data.id }).queryKey });
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: orpc.posts.listPosts.queryOptions().queryKey });
    },
  });
}