// pages/ProjectDetail.tsx
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { useProjectDetail, useProjectComments, useAddComment, useToggleLike } from "../hooks/useProjectDetail";
import { useAuthStore } from "../store/useAuthStore";

import {
    Container, MainContent, BannerSection, BannerOverlay, BannerTopArea, StatusGroup, Badge, DeadlineText,
    BannerBottomArea, TitleGroup, BannerTitle, ViewCount, BottomSection, LeftColumn, RightColumn,
    ProjectDetailsCard, DetailHeader, DetailTitle, InfoGroup, InfoRow, InfoLabelBadge, InfoValueText, DetailBody,
    TechStackCard, TechTitle, TechList, TechItem, RecruitmentSection, SectionTitle, RecruitGrid, RecruitCard,
    RecruitTop, RecruitInfo, RecruitRole, RecruitDesc, RecruitBadge, RecruitButton, CommentSection, CommentTitle,
    CommentInputWrapper, ReplyInputWrapper, CommentInput, CommentSubmitBtn, CommentList, CommentWrapper,
    CommentItem, ReplyIconWrapper, CommentContentArea, CommentHeader, CommentTime, CommentText, CommentActionArea,
    ReplyButton, ChildrenContainer, LeaderProfileCard, LeaderLabel, ProfileImage, LeaderName, LeaderIntro,
    InnerCard, CpuText, TempText, TempBarTrack, TempBarFill, AwardList, LeaderActionGroup, ActionButton, ScrapIconWrapper
} from "../styles/ProjectDetail.styles";

interface CommentType {
    CMT_ID: number;
    PJ_ID: number;
    USER_ID: number;
    CMT_REPLY: string;
    CMT_TIME: string;
    CMT_PA_ID: number | null;
    NICKNAME?: string;
    children?: CommentType[];
    depth?: number;
}

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();

    const { data: project, isLoading: isProjectLoading, isError: isProjectError } = useProjectDetail(id);
    const { data: comments, isLoading: isCommentsLoading } = useProjectComments(id);
    const addCommentMutation = useAddComment();
    const toggleLikeMutation = useToggleLike();

    useAuthStore((state) => state.user);

    const [commentText, setCommentText] = useState("");

    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    const handleCommentSubmit = () => {
        if (!commentText.trim() || typeof id !== 'string') return;
        addCommentMutation.mutate(
            { id, text: commentText, parentId: null },
            {
                onSuccess: () => setCommentText(""),
                onError: () => alert("일시적인 오류로 댓글을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.")
            }
        );
    };

    const handleReplySubmit = (parentId: number) => {
        if (!replyText.trim() || typeof id !== 'string') return;
        addCommentMutation.mutate(
            { id, text: replyText, parentId },
            {
                onSuccess: () => {
                    setReplyText("");
                    setReplyingTo(null);
                },
                onError: () => alert("댓글은 최대 3단계(답글의 답글)까지만 작성하실 수 있습니다.")
            }
        );
    };

    const commentTree = useMemo(() => {
        if (!comments || !Array.isArray(comments)) return [];

        const map = new Map<number, CommentType>();
        const roots: CommentType[] = [];

        comments.forEach(c => {
            map.set(c.CMT_ID, { ...c, children: [], depth: 0 });
        });

        map.forEach(c => {
            if (c.CMT_PA_ID) {
                const parent = map.get(c.CMT_PA_ID);
                if (parent) {
                    c.depth = (parent.depth || 0) + 1;
                    parent.children?.push(c);
                }
            } else {
                roots.push(c);
            }
        });

        return roots;
    }, [comments]);


    const renderComments = (commentNodes: CommentType[]) => {
        return commentNodes.map((comment) => {
            const canReply = (comment.depth || 0) < 2;

            return (
                <CommentWrapper key={comment.CMT_ID}>
                    <CommentItem $depth={comment.depth || 0}>
                        {(comment.depth || 0) > 0 && (
                            <ReplyIconWrapper>
                                <MdSubdirectoryArrowRight size={20} color="var(--color-caption)" />
                            </ReplyIconWrapper>
                        )}
                        <CommentContentArea $depth={comment.depth || 0}>
                            <CommentHeader>
                                <strong>{comment.NICKNAME || "알 수 없음"}</strong>
                                <CommentTime>
                                    {comment.CMT_TIME ? new Date(comment.CMT_TIME).toLocaleString('ko-KR', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                        hour12: false
                                    }).replace(/\. /g, '.').replace(/:/g, '.') : ''}
                                </CommentTime>
                            </CommentHeader>
                            <CommentText>
                                {comment.CMT_REPLY}
                            </CommentText>
                            <CommentActionArea>
                                {canReply && (
                                    <ReplyButton onClick={() => setReplyingTo(replyingTo === comment.CMT_ID ? null : comment.CMT_ID)}>
                                        {replyingTo === comment.CMT_ID ? '취소' : '답글 달기'}
                                    </ReplyButton>
                                )}
                            </CommentActionArea>
                        </CommentContentArea>
                    </CommentItem>

                    {replyingTo === comment.CMT_ID && (
                        <ReplyInputWrapper>
                            <CommentInput
                                placeholder="답글을 남겨보세요."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(comment.CMT_ID)}
                                autoFocus
                            />
                            <CommentSubmitBtn
                                onClick={() => handleReplySubmit(comment.CMT_ID)}
                                $disabled={addCommentMutation.isPending}
                            >
                                등록
                            </CommentSubmitBtn>
                        </ReplyInputWrapper>
                    )}

                    {comment.children && comment.children.length > 0 && (
                        <ChildrenContainer>
                            {renderComments(comment.children)}
                        </ChildrenContainer>
                    )}
                </CommentWrapper>
            );
        });
    };

    if (isProjectLoading) return <Container><MainContent>로딩 중...</MainContent></Container>;
    if (isProjectError || !project) return <Container><MainContent>해당 프로젝트를 찾을 수 없습니다.</MainContent></Container>;

    const techStacks = project.recruitmentFields || ["미정"];
    const isClosed = project.PJ_PROGRESS === '모집완료';

    const leaderName = project.leader?.PP_NAME || "알 수 없음";
    const leaderRole = project.leader?.PP_ROLE || "팀장";
    const leaderCpu = project.leader?.USER_CPU || 50.0;

    // hook에서 맵핑된 키 이름 호환성 처리 (title 혹은 PJ_TITLE 등)
    const projectTitle = project.title || project.PJ_TITLE || '제목 없음';
    const projectIntroduce = project.introduce || project.PJ_INTRODUCE || '';
    const projectContent = project.content || project.PJ_EXPLAIN || '상세 내용이 없습니다.';
    const projectDeadline = project.deadline || project.PJ_DEADLINE || '미정';
    const projectImage = project.image || project.PJ_IMAGE || null;

    return (
        <Container>
            <SideBar />

            <MainContent>
                {/* 등록된 이미지가 있다면 배너의 배경으로 설정 */}
                <BannerSection style={projectImage ? {
                    backgroundImage: `url(${projectImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {}}>
                    <BannerOverlay>
                        <BannerTopArea>
                            <StatusGroup>
                                <Badge $bg={isClosed ? "var(--color-gray)" : "var(--color-l-accent)"}>
                                    {project.status || project.PJ_PROGRESS || '모집중'}
                                </Badge>
                                {project.startDate || project.PJ_START_DT ? (
                                    <Badge $bg="var(--color-g-accent)">
                                        {(project.startDate || project.PJ_START_DT).replace(/-/g, '.')} 시작
                                    </Badge>
                                ) : null}
                                <DeadlineText>
                                    마감일 {projectDeadline !== '미정' ? projectDeadline.replace(/-/g, '.') : '미정'}
                                </DeadlineText>
                            </StatusGroup>
                        </BannerTopArea>

                        <BannerBottomArea>
                            <TitleGroup>
                                {/* 제목과 한 줄 소개 출력 */}
                                <BannerTitle>{projectTitle}</BannerTitle>
                                {projectIntroduce && (
                                    <div style={{ color: '#eaeaea', marginTop: '12px', fontSize: '18px', fontWeight: 500 }}>
                                        {projectIntroduce}
                                    </div>
                                )}
                            </TitleGroup>
                            <ViewCount>{project.viewCount || project.PJ_VIEW_COUNT || 0} view</ViewCount>
                        </BannerBottomArea>
                    </BannerOverlay>
                </BannerSection>

                <BottomSection>
                    <LeftColumn>
                        <ProjectDetailsCard>
                            <DetailHeader>
                                <DetailTitle>프로젝트 목표 및 설명</DetailTitle>
                                <InfoGroup>
                                    <InfoRow>
                                        <InfoLabelBadge>예산</InfoLabelBadge>
                                        <InfoValueText>
                                            {project.PJ_BUDGET ? `${project.PJ_BUDGET.toLocaleString()}원` : '미정'}
                                        </InfoValueText>
                                    </InfoRow>
                                    <InfoRow>
                                        <InfoLabelBadge>진행방식</InfoLabelBadge>
                                        <InfoValueText>{project.PJ_PROCEDURE || '미정'}</InfoValueText>
                                    </InfoRow>
                                </InfoGroup>
                            </DetailHeader>
                            <DetailBody>
                                {/* 상세 설명(EXPLAIN) 출력 */}
                                {projectContent}
                            </DetailBody>
                        </ProjectDetailsCard>

                        <TechStackCard>
                            <TechTitle>관련 분야 및 기술 스택</TechTitle>
                            <TechList>
                                {techStacks.map((tech: string, index: number) => (
                                    <TechItem key={index}>{tech}</TechItem>
                                ))}
                            </TechList>
                        </TechStackCard>

                        <RecruitmentSection>
                            <SectionTitle>모집 현황</SectionTitle>
                            <RecruitGrid>
                                <RecruitCard>
                                    <RecruitTop>
                                        <RecruitInfo>
                                            <RecruitRole>프로젝트 팀원</RecruitRole>
                                            <RecruitDesc>함께 프로젝트를 완성해 나갈 팀원을 모집합니다</RecruitDesc>
                                        </RecruitInfo>
                                        <RecruitBadge $bg={isClosed ? "var(--color-gray)" : "var(--color-l-accent)"}>
                                            {project.status || project.PJ_PROGRESS || '모집중'}
                                        </RecruitBadge>
                                    </RecruitTop>
                                    <RecruitButton $bg={isClosed ? "var(--color-gray)" : "var(--color-text)"}>
                                        {isClosed ? "지원 마감" : "지원하기"}
                                    </RecruitButton>
                                </RecruitCard>
                            </RecruitGrid>
                        </RecruitmentSection>

                        <CommentSection>
                            <CommentTitle>댓글({comments?.length || 0})</CommentTitle>

                            <CommentInputWrapper>
                                <CommentInput
                                    placeholder="새로운 댓글을 남겨보세요."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                />
                                <CommentSubmitBtn onClick={handleCommentSubmit} $disabled={addCommentMutation.isPending}>
                                    {addCommentMutation.isPending ? '등록 중' : '등록'}
                                </CommentSubmitBtn>
                            </CommentInputWrapper>

                            <CommentList>
                                {!isCommentsLoading && commentTree.length > 0 ? (
                                    renderComments(commentTree)
                                ) : (
                                    !isCommentsLoading && <div style={{ color: 'var(--color-caption)', paddingLeft: '10px' }}>첫 댓글을 남겨주세요!</div>
                                )}
                            </CommentList>
                        </CommentSection>
                    </LeftColumn>

                    <RightColumn>
                        <LeaderProfileCard>
                            <LeaderLabel>leader</LeaderLabel>
                            <ProfileImage />
                            <LeaderName>{leaderName}</LeaderName>
                            <LeaderIntro>{leaderRole}</LeaderIntro>

                            <InnerCard>
                                <CpuText>CPU</CpuText>
                                <TempText>{Number(leaderCpu).toFixed(1)}°C</TempText>
                                <TempBarTrack>
                                    <TempBarFill $score={Number(leaderCpu)} />
                                </TempBarTrack>

                                <AwardList>
                                    <li>* 열정적인 팀장</li>
                                    <li>* 성실한 리더십</li>
                                </AwardList>
                            </InnerCard>
                        </LeaderProfileCard>

                        <LeaderActionGroup>
                            <ActionButton>공유하기</ActionButton>
                            <ActionButton onClick={() => {
                                if (id && typeof id === 'string') {
                                    toggleLikeMutation.mutate(id);
                                }
                            }}>
                                스크랩
                                <ScrapIconWrapper $isLiked={project.isLiked}>
                                    {project.isLiked ? <FaStar size={20} /> : <FaRegStar size={20} />}
                                </ScrapIconWrapper>
                            </ActionButton>
                        </LeaderActionGroup>
                    </RightColumn>
                </BottomSection>
            </MainContent>
        </Container>
    );
};

export default ProjectDetail;