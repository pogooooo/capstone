import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import SideBar from '../components/SideBar';
import { useCreateProject } from '../hooks/useProjectAdd';
import { useTechRoles } from '../hooks/useTechRoles';
import {
    PageWrapper, MainContent, HeaderSection, MainTitle, SubTitle, SectionCard,
    SectionHeader, SectionTitle, RowGroup, InputGroup, Label, StyledInput, StyledSelect,
    StyledTextarea, TechStackContainer, TechBadge, AddButton, PositionGrid, PositionCard,
    PositionRole, PositionDesc, PositionCountBadge, DeletePosBtn, SubmitSection, SubmitButton,
    ModalOverlay, ModalContent, ModalTitle, ModalButtonGroup, ModalButton
} from '../styles/ProjectAdd.styles';

interface TechItem {
    UR_ID: string;
    UR_TECH: string;
}

interface DisplayPosition {
    role: string;
    count: number;
    description: string;
    detailedTechs: TechItem[];
}

interface SubmitPositionPayload {
    role: string;
    count: number;
    description: string;
    ur_job_id: string;
}

const ProjectAdd = () => {
    const navigate = useNavigate();
    const createProjectMutation = useCreateProject();
    const { data: techRoles } = useTechRoles();

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [budget, setBudget] = useState("");
    const [procedure, setProcedure] = useState("온라인");
    const [deadline, setDeadline] = useState("");
    const [endDt, setEndDt] = useState("");
    const [explain, setExplain] = useState("");

    const [positions, setPositions] = useState<DisplayPosition[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<Omit<DisplayPosition, 'detailedTechs'>>({ role: "", count: 1, description: "" });
    const [modalDetailedTechs, setModalDetailedTechs] = useState<TechItem[]>([]);

    const groupedTechRoles = (techRoles as unknown[])?.reduce((acc: Record<string, TechItem[]>, role: unknown) => {
        if (role && typeof role === 'object') {
            const values = Object.values(role);
            const tech = values[2] ? String(values[2]) : 'Unknown';
            const id = values[0] ? String(values[0]) : tech;
            const domain = values[4] ? String(values[4]) : '기타';

            if (!acc[domain]) acc[domain] = [];
            acc[domain].push({ UR_ID: id, UR_TECH: tech });
        }
        return acc;
    }, {} as Record<string, TechItem[]>);

    const availableRoles = groupedTechRoles ? Object.keys(groupedTechRoles) : [];

    useEffect(() => {
        if (availableRoles.length > 0 && !modalData.role) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setModalData(prev => ({ ...prev, role: availableRoles[0] }));
        }
    }, [techRoles, availableRoles, modalData.role]);

    const handleRoleChange = (role: string) => {
        setModalData(prev => ({ ...prev, role }));
        setModalDetailedTechs([]);
    };

    const toggleModalTech = (tech: TechItem) => {
        if (modalDetailedTechs.some(t => t.UR_ID === tech.UR_ID)) {
            setModalDetailedTechs(modalDetailedTechs.filter(t => t.UR_ID !== tech.UR_ID));
        } else {
            setModalDetailedTechs([...modalDetailedTechs, tech]);
        }
    };

    const handleOpenModal = () => {
        setModalData({ role: availableRoles[0] || "", count: 1, description: "" });
        setModalDetailedTechs([]);
        setIsModalOpen(true);
    };

    const handleAddPosition = () => {
        if (!modalData.role) {
            alert("모집 포지션을 선택해주세요.");
            return;
        }
        if (modalDetailedTechs.length === 0) {
            alert("상세 포지션을 최소 하나 이상 선택해주세요.");
            return;
        }
        if (!modalData.description.trim()) {
            alert("한 줄 소개를 입력해주세요.");
            return;
        }

        setPositions([...positions, { ...modalData, detailedTechs: modalDetailedTechs }]);
        setIsModalOpen(false);
    };

    const handleRemovePosition = (index: number) => {
        setPositions(positions.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            alert("프로젝트 명을 입력해주세요.");
            return;
        }
        if (!explain.trim()) {
            alert("프로젝트 목표 및 설명을 입력해주세요.");
            return;
        }
        if (positions.length === 0) {
            alert("최소 한 개 이상의 모집 포지션을 추가해주세요.");
            return;
        }

        const formattedDeadline = deadline ? deadline.replace(/-/g, '') : null;
        const formattedEndDt = endDt ? endDt.replace(/-/g, '') : null;
        const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

        const formattedPositions: SubmitPositionPayload[] = positions.map(pos => ({
            role: pos.role,
            count: pos.count,
            description: pos.description,
            ur_job_id: pos.detailedTechs.map(tech => tech.UR_ID).join(',')
        }));

        const payload = {
            PJ_TITLE: title,
            PJ_INTRODUCE: summary,
            PJ_EXPLAIN: explain,
            PJ_PROGRESS: "모집중",
            PJ_BUDGET: budget ? Number(budget) : 0,
            PJ_PROCEDURE: procedure,
            PJ_DEADLINE: formattedDeadline,
            PJ_END_DT: formattedEndDt,
            PJ_START_DT: todayDate,
            PJ_VIEW_COUNT: 0,
            positions: formattedPositions
        };

        createProjectMutation.mutate(payload, {
            onSuccess: (data: unknown) => {
                alert("프로젝트 등록이 완료되었습니다!");
                if (data && typeof data === 'object' && 'projectId' in data) {
                    navigate(`/projects/${(data as { projectId: string }).projectId}`);
                } else {
                    navigate('/find');
                }
            },
            onError: (error: unknown) => {
                const axiosError = error as AxiosError<{ message: string }>;
                alert(axiosError.response?.data?.message || "프로젝트 생성에 실패했습니다.");
            }
        });
    };

    return (
        <PageWrapper>
            <SideBar />

            <MainContent>
                <HeaderSection>
                    <MainTitle>프로젝트 등록</MainTitle>
                    <SubTitle>새로운 프로젝트 및 아이디어를 작성하고 최고의 팀원을 찾아보세요.</SubTitle>
                </HeaderSection>

                <SectionCard>
                    <SectionTitle>기본 정보</SectionTitle>
                    <InputGroup>
                        <Label>프로젝트 명</Label>
                        <StyledInput
                            placeholder="프로젝트 이름을 입력하세요"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>프로젝트 한 줄 소개</Label>
                        <StyledInput
                            placeholder="프로젝트를 한 줄로 짧게 소개해 주세요"
                            value={summary} onChange={(e) => setSummary(e.target.value)}
                        />
                    </InputGroup>

                    <RowGroup>
                        <InputGroup>
                            <Label>예산</Label>
                            <StyledInput
                                type="number"
                                placeholder="예산 (원)"
                                value={budget} onChange={(e) => setBudget(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>진행 방식</Label>
                            <StyledSelect value={procedure} onChange={(e) => setProcedure(e.target.value)}>
                                <option value="온라인">온라인</option>
                                <option value="오프라인">오프라인</option>
                            </StyledSelect>
                        </InputGroup>
                        <InputGroup>
                            <Label>모집 마감일</Label>
                            <StyledInput
                                type="date"
                                value={deadline} onChange={(e) => setDeadline(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>프로젝트 종료일</Label>
                            <StyledInput
                                type="date"
                                value={endDt} onChange={(e) => setEndDt(e.target.value)}
                            />
                        </InputGroup>
                    </RowGroup>
                </SectionCard>

                <SectionCard>
                    <SectionTitle>프로젝트 목표 및 설명</SectionTitle>
                    <StyledTextarea
                        placeholder="프로젝트의 상세한 목표와 내용을 작성해주세요."
                        value={explain} onChange={(e) => setExplain(e.target.value)}
                    />
                </SectionCard>

                <SectionCard>
                    <SectionHeader>
                        <SectionTitle>모집 포지션</SectionTitle>
                        <AddButton onClick={handleOpenModal}>+ 포지션 추가</AddButton>
                    </SectionHeader>

                    {positions.length > 0 ? (
                        <PositionGrid>
                            {positions.map((pos, index) => (
                                <PositionCard key={index}>
                                    <PositionCountBadge>{pos.count}명</PositionCountBadge>
                                    <PositionRole>{pos.role}</PositionRole>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0' }}>
                                        {pos.detailedTechs.map(tech => (
                                            <TechBadge key={tech.UR_ID} $isActive={true} style={{ pointerEvents: 'none', fontSize: '12px', padding: '4px 10px' }}>
                                                {tech.UR_TECH}
                                            </TechBadge>
                                        ))}
                                    </div>
                                    <PositionDesc>{pos.description}</PositionDesc>
                                    <DeletePosBtn onClick={() => handleRemovePosition(index)}>삭제</DeletePosBtn>
                                </PositionCard>
                            ))}
                        </PositionGrid>
                    ) : (
                        <div style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
                            모집할 포지션을 추가해주세요.
                        </div>
                    )}
                </SectionCard>

                <SubmitSection>
                    <SubmitButton
                        onClick={handleSubmit}
                        disabled={createProjectMutation.isPending}
                    >
                        {createProjectMutation.isPending ? "등록 중..." : "프로젝트 등록하기"}
                    </SubmitButton>
                </SubmitSection>
            </MainContent>

            {isModalOpen && (
                <ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <ModalTitle>모집 포지션 추가</ModalTitle>

                        <RowGroup style={{ marginBottom: '20px' }}>
                            <InputGroup>
                                <Label>모집 포지션</Label>
                                <StyledSelect
                                    value={modalData.role}
                                    onChange={e => handleRoleChange(e.target.value)}
                                >
                                    <option value="">직군을 선택하세요</option>
                                    {availableRoles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </StyledSelect>
                            </InputGroup>
                            <InputGroup>
                                <Label>모집 인원 (명)</Label>
                                <StyledInput
                                    type="number"
                                    min="1"
                                    value={modalData.count}
                                    onChange={e => setModalData({...modalData, count: parseInt(e.target.value) || 1})}
                                />
                            </InputGroup>
                        </RowGroup>

                        {modalData.role && groupedTechRoles[modalData.role] && (
                            <InputGroup style={{ marginBottom: '20px' }}>
                                <Label>상세 포지션 (복수 선택 가능)</Label>
                                <TechStackContainer style={{ marginTop: '8px' }}>
                                    {groupedTechRoles[modalData.role].map((tech) => {
                                        const isSelected = modalDetailedTechs.some(t => t.UR_ID === tech.UR_ID);
                                        return (
                                            <TechBadge
                                                key={tech.UR_ID}
                                                $isActive={isSelected}
                                                onClick={() => toggleModalTech(tech)}
                                            >
                                                {tech.UR_TECH}
                                            </TechBadge>
                                        );
                                    })}
                                </TechStackContainer>
                            </InputGroup>
                        )}

                        <InputGroup>
                            <Label>한 줄 소개</Label>
                            <StyledInput
                                placeholder="해당 포지션의 역할이나 우대사항을 적어주세요."
                                value={modalData.description}
                                onChange={e => setModalData({...modalData, description: e.target.value})}
                            />
                        </InputGroup>

                        <ModalButtonGroup>
                            <ModalButton $variant="cancel" onClick={() => setIsModalOpen(false)}>취소</ModalButton>
                            <ModalButton $variant="primary" onClick={handleAddPosition}>추가하기</ModalButton>
                        </ModalButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageWrapper>
    );
};

export default ProjectAdd;