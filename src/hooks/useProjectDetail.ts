// src/hooks/useProjectDetail.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export const useProjectDetail = (id: string | undefined) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await apiClient.get(`/project/${id}`);
            const project = response.data;

            if (!project) throw new Error("프로젝트를 찾을 수 없습니다.");

            return {
                // 1. 원본 DB 속성 유지
                PJ_ID: project.PJ_ID,
                PJ_TITLE: project.PJ_TITLE || '제목 없음',
                PJ_INTRODUCE: project.PJ_INTRODUCE || '',
                PJ_EXPLAIN: project.PJ_EXPLAIN || '내용 없음',
                PJ_PROGRESS: project.PJ_PROGRESS || '상태 미정',
                PJ_BUDGET: project.PJ_BUDGET || 0,
                PJ_PROCEDURE: project.PJ_PROCEDURE || '미정',
                PJ_VIEW_COUNT: project.PJ_VIEW_COUNT || 0,
                PJ_START_DT: project.PJ_START_DT || null,
                PJ_END_DT: project.PJ_END_DT || null,
                PJ_DEADLINE: project.PJ_DEADLINE || null,
                PJ_IMAGE: project.PJ_IMAGE || null,

                // 2. 프론트엔드 컴포넌트에서 쓰기 편한 camelCase 별칭 매핑
                id: project.PJ_ID,
                title: project.PJ_TITLE || '제목 없음',
                introduce: project.PJ_INTRODUCE || '',
                content: project.PJ_EXPLAIN || '내용 없음',
                status: project.PJ_PROGRESS || '상태 미정',
                progress: project.PJ_PROGRESS || '상태 미정',
                procedure: project.PJ_PROCEDURE || '미정',
                budget: project.PJ_BUDGET || 0,
                startDate: project.PJ_START_DT || null,
                endDate: project.PJ_END_DT || null,
                deadline: project.PJ_DEADLINE || null,
                image: project.PJ_IMAGE || null,
                viewCount: project.PJ_VIEW_COUNT || 0,

                // 3. 조인된 데이터들
                leader: project.leader || null,
                isLiked: project.IS_LIKED === 1,
                recruitmentFields: project.recruitment_fields || ["미정"],
            };
        },
        enabled: !!id,
    });
};

export const useProjectComments = (id: string | undefined) => {
    return useQuery({
        queryKey: ['comments', id],
        queryFn: async () => {
            if (!id) return [];
            const response = await apiClient.get(`/project/${id}/comments`);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, text, parentId }: { id: string; text: string; parentId?: number | null }) => {
            const response = await apiClient.post(`/project/${id}/comments`, {
                CMT_REPLY: text,
                CMT_PA_ID: parentId || null
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.id] });
        }
    });
};

export const useToggleLike = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const response = await apiClient.post(`/project/${id}/like`);
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', String(id)] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "스크랩 처리에 실패했습니다.");
        }
    });
};