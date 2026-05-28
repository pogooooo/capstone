import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (projectData: any) => {
            const response = await apiClient.post('/project', projectData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};