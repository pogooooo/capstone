// src/hooks/useProjectManagement.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export const useUpdateProjectStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            const response = await apiClient.patch(`/project/${id}`, { PJ_PROGRESS: status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: () => alert("상태 변경에 실패했습니다.")
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await apiClient.delete(`/project/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            alert("프로젝트가 삭제되었습니다.");
        },
        onError: () => alert("프로젝트 삭제에 실패했습니다.")
    });
};

export const useLeaveProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await apiClient.delete(`/project/${id}/leave`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            alert("프로젝트 신청이 취소되었습니다.");
        },
        onError: () => alert("신청 취소에 실패했습니다.")
    });
};