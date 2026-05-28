// src/pages/ProjectManagement.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { useProjects } from '../hooks/useProjects';
import { useUpdateProjectStatus, useDeleteProject, useLeaveProject } from '../hooks/useProjectManagement';
import * as S from '../styles/ProjectManagement.styles';

const ProjectManagement = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'my' | 'applied'>('my');

    // API 훅 연결
    const { data: projects, isLoading } = useProjects('latest');
    const updateStatusMutation = useUpdateProjectStatus();
    const deleteProjectMutation = useDeleteProject();
    const leaveProjectMutation = useLeaveProject();

    const myProjects = projects?.filter(p => p.myRole === '팀장' || p.myRole === 'leader') || [];
    const appliedProjects = projects?.filter(p => p.myRole && p.myRole !== '팀장' && p.myRole !== 'leader' && p.myRole !== '팀원') || [];

// 💡 (데이터 확인용) 백엔드에서 데이터가 어떻게 넘어오는지 콘솔창(F12)에서 확인해보세요!
    console.log("전체 프로젝트:", projects);
    console.log("내 프로젝트:", myProjects);

    // 날짜 포맷팅 함수 (YYYYMMDD -> YYYY.MM.DD)
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '미정';
        if (dateString.includes('-')) return dateString.replace(/-/g, '.');
        if (dateString.length === 8) return `${dateString.slice(0, 4)}.${dateString.slice(4, 6)}.${dateString.slice(6, 8)}`;
        return dateString;
    };

    // 상태 변경 토글 핸들러
    const handleToggleStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === '모집중' ? '모집완료' : '모집중';
        if (window.confirm(`프로젝트 상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) {
            updateStatusMutation.mutate({ id, status: newStatus });
        }
    };

    // 삭제 핸들러
    const handleDelete = (id: number) => {
        if (window.confirm("정말 이 프로젝트를 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)")) {
            deleteProjectMutation.mutate(id);
        }
    };

    // 신청 취소 핸들러
    const handleLeave = (id: number) => {
        if (window.confirm("프로젝트 지원을 취소하시겠습니까?")) {
            leaveProjectMutation.mutate(id);
        }
    };

    if (isLoading) return <S.Container><S.MainContent>로딩 중...</S.MainContent></S.Container>;

    return (
        <S.Container>
            <SideBar />

            <S.MainContent>
                <S.TopHeader>
                    <S.ToggleWrapper>
                        <S.ToggleBtn $active={viewMode === 'my'} onClick={() => setViewMode('my')}>내 프로젝트</S.ToggleBtn>
                        <S.ToggleBtn $active={viewMode === 'applied'} onClick={() => setViewMode('applied')}>신청 프로젝트</S.ToggleBtn>
                    </S.ToggleWrapper>
                    <S.PageTitle>{viewMode === 'my' ? "내 프로젝트" : "신청 프로젝트"}</S.PageTitle>
                </S.TopHeader>

                <S.StatsRow>
                    <S.StatCard>
                        <S.StatLabel>{viewMode === 'my' ? "등록 프로젝트" : "합류 완료 프로젝트"}</S.StatLabel>
                        <S.StatValue><b>{viewMode === 'my' ? myProjects.length : appliedProjects.length}</b> 건</S.StatValue>
                    </S.StatCard>
                    <S.StatCard>
                        <S.StatLabel>{viewMode === 'my' ? "대기 중 지원자" : "신청 대기 프로젝트"}</S.StatLabel>
                        {/* ⚠️ 백엔드 미구현: 가짜 데이터 (0명) */}
                        <S.StatValue><b>0</b> 명</S.StatValue>
                    </S.StatCard>
                </S.StatsRow>

                <S.ContentGrid>
                    <S.ListSection>
                        <S.SectionSubTitle>{viewMode === 'my' ? "등록 프로젝트" : "신청 프로젝트 목록"}</S.SectionSubTitle>

                        {viewMode === 'my' ? (
                            myProjects.length > 0 ? myProjects.map(project => (
                                <S.ProjectCard key={project.id}>
                                    <S.CardLeft>
                                        <S.PhotoPlaceholder style={project.image ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover' } : {}} />
                                        {/* ⚠️ 백엔드 미구현: AI 기능은 UI만 표시 */}
                                        <S.AiRecommendBtn onClick={() => alert('AI 추천 기능은 준비 중입니다.')}>AI 팀원 추천 받기</S.AiRecommendBtn>
                                    </S.CardLeft>
                                    <S.CardRight>
                                        <S.CardTopRow>
                                            <S.StatusBadge $type={project.status || '모집중'}>{project.status}</S.StatusBadge>
                                            <S.Deadline>마감일 : {formatDate(project.deadline)}</S.Deadline>
                                        </S.CardTopRow>
                                        <S.ProjectTitle onClick={() => navigate(`/projects/${project.id}`)} style={{ cursor: 'pointer' }}>
                                            {project.title}
                                        </S.ProjectTitle>
                                        <S.PositionInfo>모집 포지션 : {project.introduce || '미정'}</S.PositionInfo>

                                        {project.status === '모집중' ? (
                                            <>
                                                <S.ActionRow>
                                                    <S.ActionBtn onClick={() => project.id && handleToggleStatus(project.id, project.status || '')}>상태 변경</S.ActionBtn>
                                                </S.ActionRow>
                                                <S.ActionRow>
                                                    <S.WaitingCount>대기 인원 : 0명</S.WaitingCount>
                                                    <S.ActionBtn onClick={() => alert('준비 중인 기능입니다.')}>지원자 관리</S.ActionBtn>
                                                    <S.ActionBtn onClick={() => alert('준비 중인 기능입니다.')}>수정</S.ActionBtn>
                                                    <S.ActionBtn $variant="danger" onClick={() => project.id && handleDelete(project.id)}>삭제</S.ActionBtn>
                                                </S.ActionRow>
                                            </>
                                        ) : (
                                            <S.ActionRow style={{marginTop: 'auto'}}>
                                                <S.ActionBtn onClick={() => project.id && handleToggleStatus(project.id, project.status || '')}>모집중으로 변경</S.ActionBtn>
                                                <S.ActionBtn $variant="danger" onClick={() => project.id && handleDelete(project.id)}>삭제</S.ActionBtn>
                                            </S.ActionRow>
                                        )}
                                    </S.CardRight>
                                </S.ProjectCard>
                            )) : <div style={{ color: '#888', marginTop: '20px' }}>등록한 프로젝트가 없습니다.</div>
                        ) : (
                            appliedProjects.length > 0 ? appliedProjects.map(project => (
                                <S.ProjectCard key={project.id}>
                                    <S.CardLeft>
                                        <S.PhotoPlaceholder style={project.image ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover' } : {}} />
                                    </S.CardLeft>
                                    <S.CardRight>
                                        <S.CardTopRow>
                                            {/* ⚠️ 백엔드 미구현: 합류/대기/거절 상태가 없어서 임시로 '대기중' 표시 */}
                                            <S.StatusBadge $type="모집중">대기 중</S.StatusBadge>
                                            <S.Deadline>지원일 : {formatDate(project.startDate)}</S.Deadline>
                                        </S.CardTopRow>
                                        <S.ProjectTitle>{project.title}</S.ProjectTitle>
                                        <S.PositionInfo style={{color: 'var(--color-caption)'}}>심사 진행 중</S.PositionInfo>
                                        <S.ActionRow>
                                            <S.ActionBtn onClick={() => navigate(`/projects/${project.id}`)}>상세보기</S.ActionBtn>
                                            <S.ActionBtn $variant="danger" onClick={() => project.id && handleLeave(project.id)}>신청 취소</S.ActionBtn>
                                        </S.ActionRow>
                                    </S.CardRight>
                                </S.ProjectCard>
                            )) : <div style={{ color: '#888', marginTop: '20px' }}>신청한 프로젝트가 없습니다.</div>
                        )}
                    </S.ListSection>

                    <S.NotificationSide>
                        <S.NotiHeader>최근 알림</S.NotiHeader>
                        <S.NotiList>
                            {/* ⚠️ 백엔드 미구현: 알림 시스템 하드코딩 유지 */}
                            <S.NotiItem>
                                <S.NotiText>알림 기능은 백엔드 구현 후 연동됩니다.</S.NotiText>
                                <S.NotiTime>방금 전</S.NotiTime>
                            </S.NotiItem>
                            <S.NotiItem>
                                <S.NotiText>'반려동물 앱' 프로젝트에 지원하셨습니다.</S.NotiText>
                                <S.NotiTime>3분 전</S.NotiTime>
                            </S.NotiItem>
                        </S.NotiList>
                    </S.NotificationSide>
                </S.ContentGrid>
            </S.MainContent>
        </S.Container>
    );
};

export default ProjectManagement;