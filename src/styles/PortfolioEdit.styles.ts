// styles/PortfolioEdit.styles.ts
import styled from 'styled-components';

export const PageWrapper = styled.div`
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: var(--color-bg);
    color: var(--color-text);
`;

export const MainContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 40px;
    gap: 30px;
`;

export const TopBanner = styled.div`
    width: 100%;
    background-color: white;
    border-radius: 40px;
    display: flex;
    align-items: center;
    padding: 40px 50px;
    box-sizing: border-box;
    gap: 40px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
`;

export const ProfileImage = styled.div`
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: var(--color-gray);
    flex-shrink: 0;
`;

export const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

export const ProfileHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

export const NameAndJobs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const Nickname = styled.div`
    font-size: 36px;
    font-weight: 900;
`;

export const JobsWrapper = styled.div`
    display: flex;
    gap: 10px;
`;

export const JobBadge = styled.div`
    padding: 8px 18px;
    border-radius: 20px;
    background-color: var(--color-gray);
    font-size: 14px;
    font-weight: 700;
`;

export const TemperatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 250px;
`;

export const TemperatureText = styled.div`
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 10px;
`;

export const ProgressBarBackground = styled.div`
    width: 100%;
    height: 16px;
    background: linear-gradient(to right, #B8D6FF, #FFCE53, #FF3E3E);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
`;

export const ProgressBarFill = styled.div<{ $score: number }>`
    width: ${(props) => 100 - Math.min(Math.max(props.$score, 0), 100)}%;
    height: 100%;
    background-color: #eee;
    transition: width 0.5s ease-in-out;
`;

export const IntroText = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: var(--color-caption);
`;

export const BottomSection = styled.div`
    display: flex;
    gap: 30px;
`;

export const BottomLeft = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
    min-width: 0;
`;

export const BottomRight = styled.div`
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    flex-shrink: 0;
`;

export const PortfolioCard = styled.div`
    background-color: white;
    border-radius: 40px;
    padding: 40px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
`;

export const CardTitle = styled.h2`
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 25px;
`;

export const HistoryList = styled.ul`
    padding-left: 20px;
    line-height: 2;
`;

export const HistoryItem = styled.li`
    font-size: 16px;
    font-weight: 500;
`;

export const ImageSliderContainer = styled.div`
    width: 100%;
    height: 350px;
    position: relative;
    border-radius: 40px;
    overflow: hidden;
    background-color: var(--color-gray);
`;

export const SlideImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const SlidePlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    font-weight: 600;
`;

export const UploadLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    &:hover { color: var(--color-text); }
`;

export const DeleteImageBtn = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    color: #ff4d4f;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        background-color: #ff4d4f;
        color: white;
    }
`;

export const SlideIndicators = styled.div`
    position: absolute;
    bottom: 25px;
    right: 30px;
    display: flex;
    gap: 12px;
`;

export const IndicatorDot = styled.div<{ $isActive: boolean }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => props.$isActive ? 'var(--color-text)' : '#ccc'};
    cursor: pointer;
`;

export const AwardContainer = styled.div`
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
`;

export const AwardIcon = styled.div`font-size: 24px;`;

export const AwardInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const AwardName = styled.div`
    font-size: 16px;
    font-weight: 800;
`;

export const AwardDetail = styled.div`
    font-size: 14px;
    color: #777;
    line-height: 1.4;
`;

export const Divider = styled.hr`
    border: none;
    border-top: 1px solid #eee;
    margin: 20px 0;
`;

export const LinksContainer = styled.div`display: flex; gap: 15px;`;

export const LinkIcon = styled.a`
    width: 50px;
    height: 50px;
    background-color: #f5f5f5;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-size: 20px;
`;

export const ActionCard = styled.div`
    background-color: var(--color-text);
    border-radius: 25px;
    padding: 20px;
    display: flex;
    justify-content: center;
    cursor: pointer;
`;

export const EditButton = styled.div`
    font-size: 18px;
    color: white;
    font-weight: 800;
`;

export const AwardEditSection = styled.div`display: flex; flex-direction: column;`;

export const AwardInputGroup = styled.div`
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 20px;
    margin-bottom: 15px;
`;

export const TrashIcon = styled.div`color: #ff4d4f; cursor: pointer;`;

export const AddButton = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-caption);
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 10px;
`;

export const Label = styled.div`
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #888;
`;

export const EditInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    outline: none;
`;

export const EditTextarea = styled.textarea`
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid #ddd;
    resize: none;
    box-sizing: border-box;
    outline: none;
`;