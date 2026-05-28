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

export const BannerSection = styled.div`
    width: 100%;
    height: 300px;
    border-radius: 50px;
    background-color: var(--color-g-accent);
    position: relative;
    overflow: hidden;
`;

export const BannerOverlay = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    padding: 40px 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
`;

export const BannerTopArea = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const StatusGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const Badge = styled.div<{ $bg: string }>`
    background-color: ${(props) => props.$bg};
    border-radius: 60px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 800;
    color: ${(props) => props.$bg === 'var(--color-gray)' ? 'var(--color-text)' : 'white'};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const DeadlineText = styled.div`
    font-size: 16px;
    font-weight: 800;
    color: var(--color-text);
    margin-left: 5px;
`;

export const BannerBottomArea = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

export const TitleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const BannerTitle = styled.div`
    font-size: 40px;
    font-weight: 800;
    color: var(--color-text);
    line-height: 1.3;
    word-break: keep-all;
    max-width: 800px;
`;

export const ViewCount = styled.div`
    font-size: 20px;
    font-weight: 800;
    color: var(--color-text);
    margin-bottom: 5px;
`;

export const BottomSection = styled.div`
    display: flex;
    gap: 40px;
    margin-top: 40px;
`;

export const LeftColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 40px;
    min-width: 0;
`;

export const RightColumn = styled.div`
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-shrink: 0;
`;

export const ProjectDetailsCard = styled.div`
    width: 100%;
    min-height: 250px;
    border-radius: 40px;
    background-color: white;
    padding: 40px 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
`;

export const DetailHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 35px;
    flex-wrap: wrap;
    gap: 20px;
`;

export const DetailTitle = styled.div`
    font-size: 24px;
    font-weight: 800;
    color: var(--color-text);
`;

export const InfoGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 250px;
`;

export const InfoLabelBadge = styled.div`
    width: 80px;
    height: 32px;
    border-radius: 50px;
    background-color: var(--color-gray);
    font-size: 14px;
    font-weight: 800;
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

export const InfoValueText = styled.div`
    font-size: 16px;
    font-weight: 800;
    color: var(--color-text);
    flex: 1;
`;

export const DetailBody = styled.div`
    font-size: 16px;
    color: var(--color-text);
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: keep-all;
`;

export const TechStackCard = styled.div`
    width: 100%;
    border-radius: 40px;
    background-color: white;
    padding: 40px 50px;
    box-sizing: border-box;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
`;

export const TechTitle = styled.div`
    font-size: 24px;
    font-weight: 800;
    color: var(--color-text);
    margin-bottom: 25px;
`;

export const TechList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
`;

export const TechItem = styled.div`
    padding: 0 25px;
    height: 40px;
    border-radius: 50px;
    background-color: var(--color-gray);
    color: var(--color-text);
    font-size: 15px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const RecruitmentSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const SectionTitle = styled.div`
    font-size: 24px;
    font-weight: 800;
    color: var(--color-text);
    margin-bottom: 25px;
    padding-left: 10px;
`;

export const RecruitGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
`;

export const RecruitCard = styled.div`
    background-color: white;
    border-radius: 40px;
    padding: 35px 40px;
    box-sizing: border-box;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    gap: 25px;
`;

export const RecruitTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

export const RecruitInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const RecruitRole = styled.div`
    font-size: 22px;
    font-weight: 800;
    color: var(--color-text);
`;

export const RecruitDesc = styled.div`
    font-size: 14px;
    color: var(--color-caption);
    font-weight: 500;
`;

export const RecruitBadge = styled.div<{ $bg: string }>`
    padding: 0 15px;
    height: 28px;
    border-radius: 50px;
    background-color: ${(props) => props.$bg};
    color: ${(props) => props.$bg === 'var(--color-gray)' ? 'var(--color-text)' : 'white'};
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

export const RecruitButton = styled.div<{ $bg: string }>`
    width: 100%;
    height: 50px;
    border-radius: 50px;
    background-color: ${(props) => props.$bg};
    color: white;
    font-size: 18px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s;

    &:hover {
        opacity: 0.9;
        transform: scale(1.01);
    }
`;

export const CommentSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;

export const CommentTitle = styled.div`
    font-size: 24px;
    font-weight: 800;
    color: var(--color-text);
    margin-bottom: 25px;
    padding-left: 10px;
`;

export const CommentInputWrapper = styled.div`
    width: 100%;
    height: 60px;
    border-radius: 50px;
    background-color: white;
    display: flex;
    align-items: center;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 20px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
`;

export const ReplyInputWrapper = styled(CommentInputWrapper)`
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: var(--color-bg);
    border: 1px solid #e5e7eb;
    box-shadow: none;
`;

export const CommentInput = styled.input`
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0 25px;
    font-size: 15px;
    color: var(--color-text);
    font-weight: 500;

    &::placeholder {
        color: var(--color-caption);
    }
`;

export const CommentSubmitBtn = styled.button<{ $disabled?: boolean }>`
    width: 110px;
    height: 100%;
    border-radius: 50px;
    background-color: var(--color-text);
    color: white;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
    border: none;
    opacity: ${(props) => (props.$disabled ? 0.7 : 1)};
    transition: background-color 0.2s;

    &:hover {
        background-color: ${(props) => (props.$disabled ? 'var(--color-text)' : 'var(--color-caption)')};
    }
`;

export const CommentList = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    margin-top: 15px;
`;

export const CommentWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

export const CommentItem = styled.div<{ $depth: number }>`
    display: flex;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: ${(props) => props.$depth === 0 ? '1px solid var(--color-gray)' : 'none'};
`;

export const ReplyIconWrapper = styled.div`
    margin-top: 15px;
    margin-right: 12px;
    flex-shrink: 0;
`;

export const CommentContentArea = styled.div<{ $depth: number }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    padding: ${(props) => props.$depth === 0 ? '10px 0' : '15px 25px'};
    border-radius: ${(props) => props.$depth === 0 ? '0' : '25px'};
    box-shadow: ${(props) => props.$depth > 0 ? '0 2px 10px rgba(0,0,0,0.02)' : 'none'};
`;

export const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    strong {
        font-size: 16px;
        font-weight: 800;
        color: var(--color-text);
    }
`;

export const CommentTime = styled.span`
    font-size: 13px;
    color: var(--color-caption);
    font-weight: 500;
`;

export const CommentText = styled.div`
    font-size: 15px;
    color: var(--color-text);
    line-height: 1.6;
    margin-top: 2px;
`;

export const CommentActionArea = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
`;

export const ReplyButton = styled.div`
    font-size: 13px;
    font-weight: 800;
    color: var(--color-caption);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: var(--color-text);
    }
`;

export const ChildrenContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    padding-left: 20px;
    border-left: 2px solid #e5e7eb;
`;

export const LeaderProfileCard = styled.div`
    width: 100%;
    border-radius: 40px;
    background-color: var(--color-gray);
    padding: 40px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const LeaderLabel = styled.div`
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 18px;
    font-weight: 800;
    color: var(--color-text);
`;

export const ProfileImage = styled.div`
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: white;
    margin-top: 30px;
`;

export const LeaderName = styled.div`
    font-size: 22px;
    font-weight: 800;
    color: var(--color-text);
    margin-top: 25px;
`;

export const LeaderIntro = styled.div`
    font-size: 14px;
    color: var(--color-text);
    font-weight: 500;
    margin-top: 15px;
    text-align: center;
    line-height: 1.4;
`;

export const InnerCard = styled.div`
    width: 100%;
    border-radius: 30px;
    background-color: white;
    margin-top: 30px;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;

export const CpuText = styled.div`
    font-size: 14px;
    font-weight: 800;
    color: var(--color-text);
`;

export const TempText = styled.div`
    font-size: 28px;
    font-weight: 800;
    color: var(--color-text);
    margin-top: 8px;
`;

export const TempBarTrack = styled.div`
    width: 100%;
    height: 12px;
    background-color: var(--color-gray);
    border-radius: 10px;
    margin-top: 15px;
    overflow: hidden;
`;

export const TempBarFill = styled.div<{ $score: number }>`
    height: 100%;
    width: ${(props) => Math.min(Math.max(props.$score, 0), 100)}%;
    background-color: var(--color-l-accent);
    border-radius: 10px;
    transition: width 0.5s ease-in-out;
`;

export const AwardList = styled.ul`
    margin-top: 30px;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-text);
        line-height: 1.4;
    }
`;

export const LeaderActionGroup = styled.div`
    display: flex;
    gap: 15px;
    width: 100%;
`;

export const ActionButton = styled.div`
    flex: 1;
    height: 55px;
    border-radius: 50px;
    background-color: white;
    color: var(--color-text);
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.03);
    transition: transform 0.2s ease, background-color 0.2s;

    &:hover {
        background-color: var(--color-gray);
        transform: translateY(-2px);
    }
`;

export const ScrapIconWrapper = styled.div<{ $isLiked?: boolean }>`
    display: flex;
    align-items: center;
    margin-left: 8px;
    color: ${props => props.$isLiked ? '#FFCE53' : 'var(--color-text)'};
    transition: transform 0.2s ease, color 0.2s ease;

    &:hover {
        transform: scale(1.15);
    }
`;