import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    background-color: var(--color-bg);
    min-height: 100vh;
    width: 100%;
    color: var(--color-text);
`;

export const MainContent = styled.div`
    flex: 1;
    padding: 40px 60px;
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

/* 상단 토글 및 타이틀 */
export const TopHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const ToggleWrapper = styled.div`
    align-self: flex-end;
    display: flex;
    background-color: var(--color-gray);
    padding: 5px;
    border-radius: 30px;
`;

export const ToggleBtn = styled.div<{ $active: boolean }>`
    padding: 10px 25px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 800;
    font-size: 14px;
    background-color: ${props => props.$active ? "white" : "transparent"};
    color: ${props => props.$active ? "var(--color-text)" : "var(--color-caption)"};
    box-shadow: ${props => props.$active ? "0 2px 8px rgba(0,0,0,0.1)" : "none"};
    transition: all 0.2s;
`;

export const PageTitle = styled.h1`
    font-size: 28px;
    font-weight: 900;
    margin: 0;
    text-align: left;
`;

/* 통계 섹션 (50px Radius) */
export const StatsRow = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
`;

export const StatCard = styled.div`
    flex: 1;
    background-color: white;
    border-radius: 50px;
    padding: 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
`;

export const StatLabel = styled.span`
    font-size: 18px;
    font-weight: 700;
    color: var(--color-caption);
`;

export const StatValue = styled.span`
    font-size: 24px;
    font-weight: 900;
    color: var(--color-text);
    & b {
        color: var(--color-primary);
        font-size: 32px;
        margin-right: 5px;
    }
`;

/* 메인 레이아웃 (리스트 + 알림) */
export const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 0.8fr;
    gap: 30px;
    align-items: start;
`;

export const ListSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const SectionSubTitle = styled.h2`
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 10px;
`;

/* 프로젝트 카드 디자인 */
export const ProjectCard = styled.div`
    background-color: white;
    border-radius: 40px;
    padding: 30px;
    display: flex;
    gap: 25px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
`;

export const CardLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 200px;
`;

export const PhotoPlaceholder = styled.div`
    width: 100%;
    aspect-ratio: 16/10;
    background-color: var(--color-gray);
    border-radius: 25px;
`;

export const AiRecommendBtn = styled.div`
    width: 100%;
    padding: 10px 0;
    background-color: var(--color-text);
    color: white;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 800;
    text-align: center;
    cursor: pointer;
    &:hover { opacity: 0.9; }
`;

export const CardRight = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const CardTopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const StatusBadge = styled.div<{ $type: string }>`
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 800;
    background-color: ${props => props.$type === '모집중' ? "var(--color-l-accent)" : "var(--color-gray)"};
    color: ${props => props.$type === '모집중' ? "white" : "var(--color-caption)"};
`;

export const Deadline = styled.span`
    font-size: 13px;
    color: var(--color-caption);
    font-weight: 600;
`;

export const ProjectTitle = styled.h3`
    font-size: 20px;
    font-weight: 800;
    margin: 15px 0 5px 0;
`;

export const PositionInfo = styled.p`
    font-size: 14px;
    color: var(--color-caption);
    font-weight: 500;
    margin: 0;
`;

export const ActionRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;

export const ActionBtn = styled.div<{ $variant?: string }>`
    padding: 8px 18px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    background-color: ${props => props.$variant === 'danger' ? "#FFEBEB" : "var(--color-gray)"};
    color: ${props => props.$variant === 'danger' ? "#FF4D4D" : "var(--color-text)"};
    &:hover { filter: brightness(0.95); }
`;

export const WaitingCount = styled.div`
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 800;
    color: var(--color-primary);
    margin-right: 10px;
`;

/* 최근 알림창 */
export const NotificationSide = styled.div`
    background-color: white;
    border-radius: 40px;
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
`;

export const NotiHeader = styled.div`
    text-align: center;
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 25px;
`;

export const NotiList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const NotiItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--color-gray);
    &:last-child { border: none; }
`;

export const NotiText = styled.div`
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
`;

export const NotiTime = styled.div`
    font-size: 11px;
    color: var(--color-caption);
    font-weight: 500;
`;