import styled from 'styled-components';
import SideBar from '../components/SideBar';
import { useAuthStore } from '../store/useAuthStore';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';

const MyPageEdit = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const { data: projects, isLoading } = useProjects('latest');

    // 1. 내가 스크랩한 프로젝트
    const scrappedProjects = projects?.filter(p => p.isLiked) || [];

    // 2. 내가 참여 중인 모든 프로젝트
    const myProjects = projects?.filter(p => p.isParticipating) || [];

    // 3. 참여 중인 것과 완료된 것 분리 (상태가 '모집완료' 또는 '완료' 인 것을 완료로 간주)
    const activeProjects = myProjects.filter(p => p.status !== '모집완료');
    const completedProjects = myProjects.filter(p => p.status === '모집완료');

    return (
        <PageWrapper>
            <SideBar />

            <MainContent>
                <TopBanner>
                    <ProfileSection>
                        <ProfileImageWrapper>
                            <ProfileImage />
                            <ProfileEditIcon>✏️</ProfileEditIcon>
                        </ProfileImageWrapper>
                        <ProfileInfo>
                            <Nickname>{user?.nickname || '방문자'}</Nickname>
                            <IntroText>CPU {Number(user?.cpu || 50.0).toFixed(1)}°C "안녕하세요, {user?.nickname || '방문자'}입니다."</IntroText>
                            <EmailText>{user?.email || '이메일 정보 없음'}</EmailText>
                        </ProfileInfo>
                    </ProfileSection>
                    <BannerEditIcon>✏️ 수정</BannerEditIcon>
                </TopBanner>

                <Section>
                    <SectionTitle>참여 중인 프로젝트</SectionTitle>
                    <HorizontalScroll>
                        {isLoading ? <div>불러오는 중...</div> : activeProjects.length > 0 ? (
                            activeProjects.map((project) => (
                                <ProjectCard key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                                    <CardImagePlaceholder />
                                    <Badge>{project.status}</Badge>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDesc>{project.content}</CardDesc>
                                </ProjectCard>
                            ))
                        ) : (
                            <div>현재 진행 중인 프로젝트가 없습니다.</div>
                        )}
                    </HorizontalScroll>
                </Section>

                <Section>
                    <SectionTitle>스크랩 프로젝트</SectionTitle>
                    <HorizontalScroll>
                        {isLoading ? <div>불러오는 중...</div> : scrappedProjects.length > 0 ? (
                            scrappedProjects.map((project) => (
                                <ScrapCard key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                                    <StarIcon>⭐</StarIcon>
                                    <ScrapTitle>{project.title}</ScrapTitle>
                                    <TagsWrapper>
                                        {project.recruitmentFields?.map(field => (
                                            <Tag key={field}>#{field}</Tag>
                                        ))}
                                    </TagsWrapper>
                                </ScrapCard>
                            ))
                        ) : (
                            <div>스크랩한 프로젝트가 없습니다.</div>
                        )}
                    </HorizontalScroll>
                </Section>

                <Section>
                    <SectionTitle>완료한 프로젝트</SectionTitle>
                    <ListContainer>
                        {isLoading ? <div>불러오는 중...</div> : completedProjects.length > 0 ? (
                            completedProjects.map((project) => (
                                <ListItem key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                                    <ListTitle>{project.title}</ListTitle>
                                    <ListDetail>
                                        {project.startDate ? project.startDate.replace(/-/g, '.') : '시작일 미정'} ~ {project.endDate ? project.endDate.replace(/-/g, '.') : '종료일 미정'} | {project.myRole}
                                    </ListDetail>
                                </ListItem>
                            ))
                        ) : (
                            <div style={{ marginLeft: "10px", color: "var(--color-caption)"}}>완료된 프로젝트가 없습니다.</div>
                        )}
                    </ListContainer>
                </Section>
            </MainContent>
        </PageWrapper>
    );
};

export default MyPageEdit;

const PageWrapper = styled.div`
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: var(--color-bg);
    font-family: sans-serif;
    color: var(--color-text);
    overflow-x: hidden;
`;

const MainContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 40px;
    gap: 50px;
    min-width: 0;
    box-sizing: border-box;
`;

const BannerEditIcon = styled.div`
    position: absolute;
    top: 30px;
    right: 40px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    background-color: var(--color-gray);
    padding: 8px 16px;
    border-radius: 20px;

    &:hover {
        background-color: var(--color-g-accent);
    }
`;

const TopBanner = styled.div`
    position: relative;
    width: 100%;
    height: 250px;
    background-color: white;
    border-radius: 50px;
    display: flex;
    align-items: center;
    padding: 0 50px;
    box-sizing: border-box;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);

    &:hover ${BannerEditIcon} {
        opacity: 1;
    }
`;

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    gap: 40px;
`;

const ProfileEditIcon = styled.div`
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 35px;
    height: 35px;
    background-color: white;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.2s;

    &:hover {
        background-color: var(--color-gray);
    }
`;

const ProfileImageWrapper = styled.div`
    position: relative;
    width: 160px;
    height: 160px;

    &:hover ${ProfileEditIcon} {
        opacity: 1;
    }
`;

const ProfileImage = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--color-gray);
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
`;

const Nickname = styled.div`
    font-size: 40px;
    font-weight: 900;
    line-height: 1;
`;

const IntroText = styled.div`
    font-size: 20px;
    font-weight: 600;
`;

const EmailText = styled.div`
    font-size: 16px;
    color: var(--color-caption);
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

const SectionTitle = styled.h2`
    font-size: 30px;
    font-weight: bold;
    margin: 0;
    padding-left: 5px;
`;

const HorizontalScroll = styled.div`
    display: flex;
    gap: 25px;
    overflow-x: auto;
    padding-bottom: 15px;
    width: 100%;
    box-sizing: border-box;

    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: var(--color-caption);
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background-color: transparent;
    }
`;

const ProjectCard = styled.div`
    min-width: 320px;
    background-color: white;
    border-radius: 40px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const Badge = styled.div`
    position: absolute;
    top: 25px;
    right: 25px;
    background-color: var(--color-l-accent);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
`;

const CardImagePlaceholder = styled.div`
    width: 90px;
    height: 90px;
    border-radius: 25px;
    background-color: var(--color-gray);
    margin-bottom: 25px;
`;

const CardTitle = styled.div`
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 12px;
`;

const CardDesc = styled.div`
    font-size: 15px;
    line-height: 1.6;
    color: var(--color-caption);
`;

const ScrapCard = styled.div`
    min-width: 250px;
    max-width: 280px;
    background-color: white;
    border-radius: 40px;
    padding: 35px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const StarIcon = styled.div`
    font-size: 40px;
    color: #FFCE53;
    margin-bottom: 20px;
`;

const ScrapTitle = styled.div`
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 20px;
    text-align: center;
    word-break: keep-all;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const TagsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
`;

const Tag = styled.div`
    font-size: 13px;
    color: var(--color-text);
    background-color: var(--color-gray);
    padding: 6px 14px;
    border-radius: 12px;
    font-weight: bold;
`;

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

const ListItem = styled.div`
    width: 100%;
    background-color: white;
    border-radius: 40px;
    padding: 35px 45px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    box-sizing: border-box;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateX(5px);
    }
`;

const ListTitle = styled.div`
    font-size: 24px;
    font-weight: 800;
`;

const ListDetail = styled.div`
    font-size: 16px;
    color: var(--color-caption);
    font-weight: 600;
`;