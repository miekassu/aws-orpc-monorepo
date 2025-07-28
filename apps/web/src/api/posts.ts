import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orpc } from '../lib/orpc';

// List Posts Query
export function useListPosts() {
  return useQuery(orpc.posts.listPosts.queryOptions());
}

// Get Single Post Query
export function useGetPost(id: string) {
  return useQuery(orpc.posts.getPost.queryOptions({ input: { id } }));
}

// Create Post Mutation
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation(orpc.posts.createPost.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.posts.listPosts.key() });
    },
  }));
}

// Update Post Mutation
export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation(orpc.posts.updatePost.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orpc.posts.getPost.key({ input: { id: data.id } }) });
      queryClient.invalidateQueries({ queryKey: orpc.posts.listPosts.key() });
    },
  }));
}

// Delete Post Mutation
export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation(orpc.posts.deletePost.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.posts.listPosts.key() });
    },
  }));
}