// styles/ProjectFind.styles.ts
import styled from "styled-components";

export const Container = styled.div`
    background-color: var(--color-bg);
    width: 100%;
    min-height: 100vh;
    display: flex;
    color: var(--color-text);
`;

export const MainContent = styled.div`
    flex: 1;
    padding: 50px;
    display: flex;
    flex-direction: column;
`;

export const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
`;

export const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
`;

export const MainTitle = styled.div`
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
`;

export const SubTitle = styled.div`
    font-size: 16px;
    color: var(--color-caption);
    font-weight: 500;
`;

export const ToggleContainer = styled.div`
    width: 160px;
    height: 40px;
    background-color: GRAY;
    border-radius: 50px;
    display: flex;
    align-items: center;
    padding: 0 5px;
    justify-content: space-between;
`;

export const ToggleButton = styled.div<{ $isSelected: boolean }>`
    width: 75px;
    height: 30px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    background-color: ${props => props.$isSelected ? 'white' : 'transparent'};
    color: ${props => props.$isSelected ? 'var(--color-text)' : 'WHITE'};
    box-shadow: ${props => props.$isSelected ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'};
    transition: all 0.2s ease-in-out;
`;

export const TabSection = styled.div`
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
`;

export const Tab = styled.div<{ $isActive: boolean }>`
    width: 120px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    background-color: ${props => props.$isActive ? 'var(--color-primary)' : 'white'};
    color: ${props => props.$isActive ? 'white' : 'var(--color-text)'};
    box-shadow: ${props => props.$isActive ? '0 4px 10px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.05)'};
    cursor: pointer;
    font-weight: 800;
    font-size: 15px;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

export const SubMenuWrapper = styled.div`
    width: 100%;
    background-color: var(--color-d-accent);
    border-radius: 30px;
    padding: 25px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    box-sizing: border-box;
    margin-bottom: 30px;
`;

export const SubMenuItem = styled.div`
    padding: 0 25px;
    height: 38px;
    background-color: white;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
`;

export const ProjectList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-top: 10px;
`;

export const ProjectCard = styled.div`
    display: flex;
    width: 100%;
    height: 180px;
    align-items: stretch;
    background-color: white;
    border-radius: 40px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    }
`;

export const ProjectImage = styled.div<{ $bgImage?: string | null }>`
    width: 320px;
    height: 100%;
    background-color: var(--color-gray);
    flex-shrink: 0;
    
    /* 🔥 썸네일 이미지가 있으면 배경으로 표시 */
    background-image: ${props => props.$bgImage ? `url(${props.$bgImage})` : 'none'};
    background-size: cover;
    background-position: center;
`;

export const ProjectInfo = styled.div`
    flex: 1;
    padding: 25px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const TopArea = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const BadgeGroup = styled.div`
    display: flex;
    gap: 10px;
`;

export const StatusBadge = styled.div<{ $status: string }>`
    padding: 0 18px;
    height: 26px;
    background-color: ${props => props.$status === '모집완료' ? 'var(--color-gray)' : 'var(--color-d-accent)'};
    color: ${props => props.$status === '모집완료' ? 'var(--color-text)' : 'white'};
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
`;

export const PositionBadge = styled.div`
    padding: 0 18px;
    height: 26px;
    background-color: var(--color-l-accent);
    color: white;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
`;

export const StatusArea = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const CountInfo = styled.span`
    font-size: 14px;
    font-weight: 800;
    color: var(--color-primary);
`;

export const ScrapButton = styled.div<{ $isLiked?: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${props => props.$isLiked ? '#FFCE53' : '#d1d5db'};
    transition: transform 0.2s ease, color 0.2s ease;

    &:hover {
        color: #FFCE53;
        transform: scale(1.15);
    }
`;

export const CardTitle = styled.div`
    font-size: 22px;
    font-weight: 800;
`;

export const BottomArea = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

export const Description = styled.div`
    font-size: 14px;
    color: var(--color-caption);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
`;

export const ApplyButton = styled.div`
    padding: 10px 28px;
    background-color: var(--color-text);
    color: white;
    border-radius: 50px;
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }
`;