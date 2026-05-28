// useProjects.ts 수정
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export interface Project {
    introduce: string;
    PJ_ID: number;
    PJ_TITLE?: string;
    PJ_INTRODUCE?: string;
    PJ_EXPLAIN: string;
    PJ_PROGRESS: string;
    PJ_BUDGET: number;
    PJ_PROCEDURE: string;
    PJ_VIEW_COUNT: number;
    PJ_START_DT: string | null;
    PJ_END_DT: string | null;
    PJ_DEADLINE?: string | null;
    PJ_IMAGE?: string | null;

    id?: number;
    title?: string;
    content?: string;
    status?: string;
    viewCount?: number;
    startDate?: string | null;
    endDate?: string | null;
    deadline?: string | null;
    image?: string | null;
    recruitmentFields?: string[];
    participantsCount?: number;
    isLiked?: boolean;
    isParticipating: boolean;
    myRole: string;
}

const fetchProjects = async (sortType: 'latest' | 'popular'): Promise<Project[]> => {
    const response = await apiClient.get('/project');
    const data = response.data;

    const projects: Project[] = data.map((item: any) => ({
        PJ_ID: item.PJ_ID,
        PJ_TITLE: item.PJ_TITLE || '',
        PJ_INTRODUCE: item.PJ_INTRODUCE || '',
        PJ_EXPLAIN: item.PJ_EXPLAIN || '',
        PJ_PROGRESS: item.PJ_PROGRESS || '모집중',
        PJ_BUDGET: item.PJ_BUDGET || 0,
        PJ_PROCEDURE: item.PJ_PROCEDURE || '',
        PJ_VIEW_COUNT: item.PJ_VIEW_COUNT || 0,
        PJ_START_DT: item.PJ_START_DT || null,
        PJ_END_DT: item.PJ_END_DT || null,
        PJ_DEADLINE: item.PJ_DEADLINE || null,
        PJ_IMAGE: item.PJ_IMAGE || null,

        id: item.PJ_ID,
        title: item.PJ_TITLE || item.PJ_EXPLAIN || '제목 없음',
        content: item.PJ_INTRODUCE || item.PJ_PROCEDURE || '상세 내용이 없습니다.',
        status: item.PJ_PROGRESS || '모집중',
        viewCount: item.PJ_VIEW_COUNT || 0,
        startDate: item.PJ_START_DT || null,
        endDate: item.PJ_END_DT || null,
        deadline: item.PJ_DEADLINE || null,
        image: item.PJ_IMAGE || null,
        recruitmentFields: item.recruitment_fields || ['프론트엔드', '백엔드'],
        participantsCount: item.participants_count || 1,
        isLiked: item.IS_LIKED === 1,
        isParticipating: item.IS_PARTICIPATING === 1,
        myRole: item.MY_ROLE || '팀원',
    }));

    if (sortType === 'popular') {
        return projects.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }

    return projects.sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const useProjects = (sortType: 'latest' | 'popular' = 'latest') => {
    return useQuery({
        queryKey: ['projects', sortType],
        queryFn: () => fetchProjects(sortType),
    });
};