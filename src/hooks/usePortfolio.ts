// src/hooks/usePortfolio.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export const usePortfolio = () => {
    return useQuery({
        queryKey: ['portfolio'],
        queryFn: async () => {
            const response = await apiClient.get('/portfolio');
            return response.data;
        },
        retry: false,
    });
};

export const useUpdatePortfolio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.put('/portfolio', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
            alert("포트폴리오가 성공적으로 저장되었습니다.");
        },
        onError: () => {
            alert("포트폴리오 저장에 실패했습니다.");
        }
    });
};