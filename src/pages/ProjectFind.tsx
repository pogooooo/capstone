import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegStar, FaStar } from "react-icons/fa";
import SideBar from "../components/SideBar";
import { useProjects } from '../hooks/useProjects';
import { useToggleLike } from '../hooks/useProjectDetail';

// 분리된 스타일 임포트
import {
    Container, MainContent, HeaderSection, TitleSection, MainTitle, SubTitle, ToggleContainer, ToggleButton,
    TabSection, Tab, SubMenuWrapper, SubMenuItem, ProjectList, ProjectCard, ProjectImage, ProjectInfo, TopArea,
    BadgeGroup, StatusBadge, PositionBadge, StatusArea, CountInfo, ScrapButton, CardTitle, BottomArea,
    Description, ApplyButton
} from '../styles/ProjectFind.styles';

const ProjectFind = () => {
    const navigate = useNavigate();

    const [sortType, setSortType] = useState<'latest' | 'popular'>('latest');
    const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'position' | 'scrap'>('all');

    const { data: projects, isLoading, isError } = useProjects(sortType);
    const toggleLikeMutation = useToggleLike();

    const techStacks = ["React", "TypeScript", "Node.js", "Python", "Figma"];
    const positions = ["프론트엔드", "백엔드", "디자이너", "기획자"];

    return (
        <Container>
            <SideBar />

            <MainContent>
                <HeaderSection>
                    <TitleSection>
                        <MainTitle>모집 중 프로젝트</MainTitle>
                        <SubTitle>나의 재능과 실력에 맞는 프로젝트를 찾아보세요</SubTitle>
                    </TitleSection>

                    <ToggleContainer>
                        <ToggleButton
                            $isSelected={sortType === 'latest'}
                            onClick={() => setSortType('latest')}
                        >
                            최신순
                        </ToggleButton>
                        <ToggleButton
                            $isSelected={sortType === 'popular'}
                            onClick={() => setSortType('popular')}
                        >
                            인기순
                        </ToggleButton>
                    </ToggleContainer>
                </HeaderSection>

                <TabSection>
                    <Tab $isActive={activeTab === 'all'} onClick={() => setActiveTab('all')}>전체</Tab>
                    <Tab $isActive={activeTab === 'tech'} onClick={() => setActiveTab('tech')}>기술 스택</Tab>
                    <Tab $isActive={activeTab === 'position'} onClick={() => setActiveTab('position')}>포지션</Tab>
                    <Tab $isActive={activeTab === 'scrap'} onClick={() => setActiveTab('scrap')}>스크랩</Tab>
                </TabSection>

                {(activeTab === 'tech' || activeTab === 'position') && (
                    <SubMenuWrapper>
                        {activeTab === 'tech' && techStacks.map(stack => (
                            <SubMenuItem key={stack}>{stack}</SubMenuItem>
                        ))}
                        {activeTab === 'position' && positions.map(pos => (
                            <SubMenuItem key={pos}>{pos}</SubMenuItem>
                        ))}
                    </SubMenuWrapper>
                )}

                {isLoading && <div>프로젝트 목록을 불러오는 중입니다...</div>}
                {isError && <div>프로젝트를 불러오는데 실패했습니다.</div>}

                {!isLoading && !isError && projects && (
                    <ProjectList>
                        {projects.map((project) => (
                            <ProjectCard key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                                {/* 🔥 백엔드에서 받아온 이미지를 썸네일로 출력 */}
                                <ProjectImage $bgImage={project.image} />
                                <ProjectInfo>
                                    <TopArea>
                                        <BadgeGroup>
                                            <StatusBadge $status={project.status || '상태 미정'}>
                                                {project.status || '상태 미정'}
                                            </StatusBadge>
                                            <PositionBadge>{project.recruitmentFields?.join('/') || '포지션 미정'}</PositionBadge>
                                        </BadgeGroup>

                                        <StatusArea>
                                            <CountInfo>조회수 {project.viewCount}</CountInfo>
                                            <ScrapButton
                                                $isLiked={project.isLiked}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (project.id !== undefined) {
                                                        toggleLikeMutation.mutate(project.id);
                                                    }
                                                }}
                                            >
                                                {project.isLiked ? <FaStar size={24} /> : <FaRegStar size={24}/>}
                                            </ScrapButton>
                                        </StatusArea>
                                    </TopArea>

                                    <CardTitle>{project.title}</CardTitle>

                                    <BottomArea>
                                        <Description>{project.content}</Description>
                                        <ApplyButton>지원하기</ApplyButton>
                                    </BottomArea>
                                </ProjectInfo>
                            </ProjectCard>
                        ))}
                    </ProjectList>
                )}
            </MainContent>
        </Container>
    );
};

export default ProjectFind;