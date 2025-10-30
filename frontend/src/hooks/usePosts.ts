import { useQuery } from '@tanstack/react-query';
import { postService } from '@/lib/api';
import type { Post, PaginatedResponse } from '@/lib/types';

export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery<PaginatedResponse<Post>>({
    queryKey: ['posts', page, limit],
    queryFn: async () => {
      const response = await postService.getAllPosts(page, limit);
      return response.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
