import { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import { useAuthStore } from "../store/useAuthStore";
import { usePortfolio, useUpdatePortfolio } from "../hooks/usePortfolio";
import { FaPlus, FaTrash, FaCamera } from "react-icons/fa";
import { useTechRoles } from '../hooks/useTechRoles';

import {
    PageWrapper, MainContent, TopBanner, ProfileImage, ProfileInfo, ProfileHeader, NameAndJobs,
    Nickname, JobsWrapper, JobBadge, TemperatureContainer, TemperatureText, ProgressBarBackground,
    ProgressBarFill, IntroText, BottomSection, BottomLeft, BottomRight, PortfolioCard, CardTitle,
    HistoryList, HistoryItem, ImageSliderContainer, SlideImage, SlidePlaceholder, UploadLabel,
    DeleteImageBtn, SlideIndicators, IndicatorDot, AwardContainer, AwardIcon, AwardInfo, AwardName,
    AwardDetail, Divider, LinksContainer, LinkIcon, ActionCard, EditButton, AwardEditSection,
    AwardInputGroup, TrashIcon, AddButton, Label, EditInput, EditTextarea
} from '../styles/PortfolioEdit.styles';

interface AwardItem {
    title: string;
    detail: string;
}

interface ParticipatedProject {
    PJ_START_DT: string;
    PJ_END_DT: string | null;
    PJ_TITLE: string;
    PP_ROLE: string;
}

// 기술 스택 아이템을 위한 명확한 타입 정의 (any 대체)
interface TechItem {
    UR_ID: string;
    UR_TECH: string;
}

const PortfolioEdit = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const user = useAuthStore((state) => state.user);

    const { data: portfolio, isLoading } = usePortfolio();
    const updatePortfolioMutation = useUpdatePortfolio();

    const [isEditing, setIsEditing] = useState(false);
    const { data: techRoles } = useTechRoles();

    const [introduction, setIntroduction] = useState("");
    const [techStack, setTechStack] = useState("");
    const [externalLink, setExternalLink] = useState("");
    const [awards, setAwards] = useState<AwardItem[]>([{ title: "", detail: "" }]);
    const [images, setImages] = useState<(string | null)[]>([null, null, null]);

    const currentStacks = techStack.split(',').map(s => s.trim()).filter(Boolean);

    const toggleTech = (tech: string) => {
        if (currentStacks.includes(tech)) {
            setTechStack(currentStacks.filter(s => s !== tech).join(','));
        } else {
            setTechStack([...currentStacks, tech].join(','));
        }
    };

    useEffect(() => {
        if (portfolio && !isEditing) {
            const timer = setTimeout(() => {
                setIntroduction(portfolio.PF_INTRODUCTION || "");

                const cleanStack = (portfolio.PF_TECH || "").split(',').map((s: string) => s.trim()).filter(Boolean).join(',');
                setTechStack(cleanStack);

                setExternalLink(portfolio.PF_URL || "");

                const titles = (portfolio.PF_AWARD || "").split('|').filter(Boolean);
                const details = (portfolio.PF_AWARD_DETAIL || "").split('|');

                const mappedAwards = titles.map((t: string, i: number) => ({
                    title: t,
                    detail: details[i] || ""
                }));

                setAwards(mappedAwards.length > 0 ? mappedAwards : [{ title: "", detail: "" }]);
                setImages([portfolio.PF_IMG1 || null, portfolio.PF_IMG2 || null, portfolio.PF_IMG3 || null]);
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [portfolio, isEditing]);

    const handleAddAward = () => {
        setAwards([...awards, { title: "", detail: "" }]);
    };

    const handleRemoveAward = (index: number) => {
        setAwards(awards.filter((_, i) => i !== index));
    };

    const handleAwardChange = (index: number, field: keyof AwardItem, value: string) => {
        const newAwards = [...awards];
        newAwards[index][field] = value;
        setAwards(newAwards);
    };

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const newImages = [...images];
                newImages[index] = base64String;
                setImages(newImages);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (index: number) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
    };

    const handleSave = () => {
        const pfAward = awards.map(a => a.title).join('|');
        const pfAwardDetail = awards.map(a => a.detail).join('|');

        updatePortfolioMutation.mutate({
            introduction: introduction,
            tech_stack: techStack,
            external_link: externalLink,
            awards: pfAward,
            award_detail: pfAwardDetail,
            image_1: images[0],
            image_2: images[1],
            image_3: images[2]
        }, {
            onSuccess: () => setIsEditing(false)
        });
    };

    // any 타입과 Math.random() 에러가 나던 부분 수정
    const groupedTechRoles = (techRoles as unknown[])?.reduce((acc: Record<string, TechItem[]>, role: unknown) => {
        if (role && typeof role === 'object') {
            const values = Object.values(role);

            // 값이 없을 경우 Math.random() 대신 tech명 자체를 아이디로 사용하여 순수성(purity) 보장
            const tech = values[2] ? String(values[2]) : 'Unknown';
            const id = values[0] ? String(values[0]) : tech;
            const domain = values[4] ? String(values[4]) : '기타';

            if (!acc[domain]) acc[domain] = [];
            acc[domain].push({ UR_ID: id, UR_TECH: tech });
        }
        return acc;
    }, {} as Record<string, TechItem[]>);

    if (isLoading) return <PageWrapper><MainContent>사용자 정보를 불러오고 있습니다...</MainContent></PageWrapper>;

    const nickname = user?.nickname || '방문자';
    const cpuTemperature = Number(user?.cpu) || 36.5;

    return (
        <PageWrapper>
            <SideBar />

            <MainContent>
                <TopBanner>
                    <ProfileImage />
                    <ProfileInfo>
                        <ProfileHeader>
                            <NameAndJobs>
                                <Nickname>{nickname}</Nickname>
                                <JobsWrapper>
                                    <JobBadge>프론트엔드</JobBadge>
                                    <JobBadge>디자인</JobBadge>
                                </JobsWrapper>
                            </NameAndJobs>

                            <TemperatureContainer>
                                <TemperatureText>{cpuTemperature.toFixed(1)}°C</TemperatureText>
                                <ProgressBarBackground>
                                    <ProgressBarFill $score={cpuTemperature} />
                                </ProgressBarBackground>
                            </TemperatureContainer>
                        </ProfileHeader>

                        {isEditing ? (
                            <EditInput
                                placeholder="자신을 표현할 한 줄 소개를 입력해주세요."
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                                style={{ width: '80%', marginTop: '5px' }}
                            />
                        ) : (
                            <IntroText>"{introduction || `안녕하세요, 성장을 꿈꾸는 개발자 ${nickname}입니다.`}"</IntroText>
                        )}
                    </ProfileInfo>
                </TopBanner>

                <BottomSection>
                    <BottomLeft>
                        <PortfolioCard>
                            <CardTitle>프로젝트 경험 및 이력</CardTitle>
                            <HistoryList>
                                {portfolio?.participatedProjects?.map((proj: ParticipatedProject, idx: number) => (
                                    <HistoryItem key={`auto-${idx}`}>
                                        {proj.PJ_START_DT} ~ {proj.PJ_END_DT || '진행 중'} | {proj.PJ_TITLE} ({proj.PP_ROLE})
                                    </HistoryItem>
                                ))}

                                {awards.map((award, i) => (
                                    award.title && <HistoryItem key={`manual-${i}`}>{award.title}</HistoryItem>
                                ))}

                                {(!portfolio?.participatedProjects?.length && !awards.some(a => a.title)) && (
                                    <HistoryItem>등록된 프로젝트 경험이 없습니다.</HistoryItem>
                                )}
                            </HistoryList>
                        </PortfolioCard>

                        <ImageSliderContainer>
                            {images[currentSlide] ? (
                                <>
                                    <SlideImage src={images[currentSlide]!} />
                                    {isEditing && (
                                        <DeleteImageBtn onClick={() => handleDeleteImage(currentSlide)}>
                                            <FaTrash /> 삭제
                                        </DeleteImageBtn>
                                    )}
                                </>
                            ) : (
                                <SlidePlaceholder>
                                    {isEditing ? (
                                        <UploadLabel>
                                            <FaCamera size={30} />
                                            <span>사진 업로드</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleImageUpload(currentSlide, e)}
                                            />
                                        </UploadLabel>
                                    ) : "등록된 사진이 없습니다."}
                                </SlidePlaceholder>
                            )}
                            <SlideIndicators>
                                {[0, 1, 2].map((index) => (
                                    <IndicatorDot
                                        key={index}
                                        $isActive={index === currentSlide}
                                        onClick={() => setCurrentSlide(index)}
                                    />
                                ))}
                            </SlideIndicators>
                        </ImageSliderContainer>
                    </BottomLeft>

                    <BottomRight>
                        <PortfolioCard>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <CardTitle>보유 기술 스택</CardTitle>
                                {isEditing && currentStacks.length > 0 && (
                                    <span
                                        onClick={() => setTechStack("")}
                                        style={{ fontSize: '12px', cursor: 'pointer', color: '#FF4D4D', fontWeight: 'bold' }}
                                    >
                                        초기화
                                    </span>
                                )}
                            </div>

                            {isEditing ? (
                                <>
                                    <div style={{ fontSize: '13px', color: 'var(--color-caption)', marginBottom: '15px' }}>
                                        사용 가능한 기술 스택을 선택해주세요.
                                    </div>

                                    {groupedTechRoles && Object.entries(groupedTechRoles).map(([domain, roles]) => (
                                        <div key={domain} style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '8px' }}>
                                                {domain}
                                            </div>
                                            <JobsWrapper style={{ flexWrap: 'wrap', gap: '8px' }}>
                                                {/* any 타입 오류가 나던 부분 명시적 타입 지정 */}
                                                {roles.map((role: TechItem) => {
                                                    const isSelected = currentStacks.includes(role.UR_TECH);
                                                    return (
                                                        <JobBadge
                                                            key={role.UR_ID}
                                                            style={{
                                                                cursor: 'pointer',
                                                                backgroundColor: isSelected ? 'var(--color-primary)' : '#f5f5f5',
                                                                color: isSelected ? 'white' : '#666',
                                                                border: isSelected ? 'none' : '1px solid #ddd'
                                                            }}
                                                            onClick={() => toggleTech(role.UR_TECH)}
                                                        >
                                                            {role.UR_TECH}
                                                        </JobBadge>
                                                    );
                                                })}
                                            </JobsWrapper>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <JobsWrapper style={{ flexWrap: 'wrap' }}>
                                    {currentStacks.length > 0 ? currentStacks.map((tech, i) => (
                                        <JobBadge key={i}>{tech}</JobBadge>
                                    )) : <span style={{fontSize: '14px', color: '#888'}}>등록된 스택이 없습니다.</span>}
                                </JobsWrapper>
                            )}
                        </PortfolioCard>

                        <PortfolioCard>
                            <CardTitle>수상 및 링크</CardTitle>
                            {isEditing ? (
                                <AwardEditSection>
                                    {awards.map((award, index) => (
                                        <AwardInputGroup key={index}>
                                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                                <Label>수상 #{index + 1}</Label>
                                                {awards.length > 1 && <TrashIcon onClick={() => handleRemoveAward(index)}><FaTrash/></TrashIcon>}
                                            </div>
                                            <EditInput
                                                placeholder="수상 명칭"
                                                value={award.title}
                                                onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                                                style={{marginBottom: '8px'}}
                                            />
                                            <EditTextarea
                                                placeholder="상세 설명"
                                                value={award.detail}
                                                onChange={(e) => handleAwardChange(index, 'detail', e.target.value)}
                                                style={{minHeight: '60px', marginBottom: '15px'}}
                                            />
                                        </AwardInputGroup>
                                    ))}
                                    <AddButton onClick={handleAddAward}><FaPlus/> 추가하기</AddButton>
                                    <Divider />
                                    <Label>참고 링크</Label>
                                    <EditInput
                                        placeholder="https://github.com/..."
                                        value={externalLink}
                                        onChange={(e) => setExternalLink(e.target.value)}
                                    />
                                </AwardEditSection>
                            ) : (
                                <>
                                    {awards.map((award, i) => (
                                        award.title && (
                                            <AwardContainer key={i}>
                                                <AwardIcon>🏆</AwardIcon>
                                                <AwardInfo>
                                                    <AwardName>{award.title}</AwardName>
                                                    <AwardDetail>{award.detail}</AwardDetail>
                                                </AwardInfo>
                                            </AwardContainer>
                                        )
                                    ))}
                                    {awards.length === 0 || (awards.length === 1 && !awards[0].title) && (
                                        <span style={{fontSize: '14px', color: '#888'}}>등록된 수상이 없습니다.</span>
                                    )}
                                    <Divider />
                                    <LinksContainer>
                                        {externalLink ? (
                                            <LinkIcon href={externalLink} target="_blank">🔗</LinkIcon>
                                        ) : (
                                            <span style={{fontSize: '13px', color: '#888'}}>등록된 링크가 없습니다.</span>
                                        )}
                                    </LinksContainer>
                                </>
                            )}
                        </PortfolioCard>

                        <ActionCard onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                            <EditButton>
                                {isEditing ? (updatePortfolioMutation.isPending ? "저장 중..." : "💾 저장하기") : "✏️ 수정하기"}
                            </EditButton>
                        </ActionCard>
                        {isEditing && (
                            <ActionCard onClick={() => setIsEditing(false)} style={{backgroundColor: '#eee', marginTop: '-15px'}}>
                                <EditButton style={{color: '#666'}}>취소</EditButton>
                            </ActionCard>
                        )}
                    </BottomRight>
                </BottomSection>
            </MainContent>
        </PageWrapper>
    );
};

export default PortfolioEdit;