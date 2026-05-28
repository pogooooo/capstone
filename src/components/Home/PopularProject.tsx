import styled from "styled-components";
import { useProjects } from "../../hooks/useProjects.ts";
import { useNavigate } from "react-router-dom";

const PopularProject = () => {
    const { data: projects, isLoading, isError } = useProjects();
    const navigate = useNavigate();

    if (isLoading) return <div>프로젝트를 불러오는 중입니다...</div>;
    if (isError) return <div>프로젝트를 불러오는데 실패했습니다.</div>;
    if (!projects) return null;

    return (
        <Wrapper>
            <PTitleWrapper>
                <div>
                    <PTitle>인기 프로젝트</PTitle>
                    <PCaption>지금 가장 뜨거운 반응을 얻고 있는 프로젝트</PCaption>
                </div>
                <PToProjectList onClick={() => navigate('/projects')}>전체보기 →</PToProjectList>
            </PTitleWrapper>

            <ProjectList>
                {projects.map((project) => {
                    const visibleAvatars = Math.min(project.participantsCount, 3);
                    const hiddenCount = project.participantsCount - 3;

                    return (
                        <ProjectCard
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <Banner>
                                <Thumbnail></Thumbnail>
                                <div>{project.recruitmentFields?.join('/') || '포지션 미정'}</div>
                            </Banner>
                            <Title>{project.title}</Title>
                            <Description>{project.content}</Description>

                            <AvatarStack>
                                {Array.from({ length: visibleAvatars }).map((_, index) => (
                                    <AvatarCircle
                                        key={index}
                                        $index={index}
                                        $isFirst={index === 0}
                                    />
                                ))}

                                {hiddenCount > 0 && (
                                    <ExtraCountCircle $index={visibleAvatars}>
                                        +{hiddenCount}
                                    </ExtraCountCircle>
                                )}
                            </AvatarStack>
                        </ProjectCard>
                    );
                })}
            </ProjectList>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 80%;
    margin: 0 50px;
`

const PTitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    color: var(--color-text);
`

const PTitle = styled.div`
    font-size: 26px;
    font-weight: bold;
`

const PCaption = styled.div`
    font-size: 18px;
`

const PToProjectList = styled.div`
    font-size: 17px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.7;
    }
`

const Banner = styled.div`
    display: flex;
    justify-content: space-between;

    font-size: 10px;
    color: var(--color-caption);
`

const Thumbnail = styled.div`
    width: 50px;
    height: 50px;
    background-color: #FFCE53;
    border-radius: 100%;
`

const Title = styled.div`
    color: var(--color-text);
    font-size: 19px;
    font-weight: bold;
`

const Description = styled.div`
    color: var(--color-text);
    font-size: 13px;
`

const ProjectList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 300px);
    column-gap: 30px;
    row-gap: 40px;

    margin-top: 20px;

    @media (max-width: 1700px) {
        grid-template-columns: repeat(2, 300px);
    }
    @media (max-width: 1300px) {
        grid-template-columns: repeat(1, 300px);
    }
`

const ProjectCard = styled.div`
    width: 100%;
    height: 250px;
    background-color: white;
    border-radius: 50px;

    padding: 30px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    }
`

const AvatarStack = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const AvatarCircle = styled.div<{ $index: number; $isFirst: boolean }>`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #d1d5db;
    border: 2px solid white;

    margin-left: ${(props) => (props.$isFirst ? '0' : '-15px')};

    z-index: ${(props) => props.$index};

    position: relative;
`;

const ExtraCountCircle = styled.div<{ $index: number }>`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f3f4f6;
    border: 2px solid white;
    margin-left: -15px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 12px;
    font-weight: bold;
    color: #4b5563;

    z-index: ${(props) => props.$index};
    position: relative;
`;

export default PopularProject;