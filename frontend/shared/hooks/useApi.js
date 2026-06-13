import { useMutation, useQuery } from '@tanstack/react-query';

export function useApiQuery(key, queryFn, options = {}) {
  return useQuery({ queryKey: key, queryFn, staleTime: 60_000, ...options });
}

export function useApiMutation(mutationFn, options = {}) {
  return useMutation({ mutationFn, ...options });
}
