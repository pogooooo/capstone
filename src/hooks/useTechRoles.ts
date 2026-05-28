// src/hooks/useTechRoles.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export interface TechRole {
    UR_ID: string;
    UR_JOB: string;      // 예: 개발, 데이터베이스
    UR_TECH: string;     // 예: react, sql, mysql
    UR_WEIGHT: number;   // 예: 1.5
    UR_DOMAIN: string;   // 예: 프론트엔드, 데이터베이스
    UR_CATEGORY: string; // 예: framework, rdbms
}

export const useTechRoles = () => {
    return useQuery({
        queryKey: ['techRoles'],
        queryFn: async (): Promise<TechRole[]> => {
            const response = await apiClient.get('/tech/roles'); // 라우터 설정에 맞게 경로 조정
            return response.data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 스택 데이터는 자주 바뀌지 않으므로 24시간 캐싱
    });
};