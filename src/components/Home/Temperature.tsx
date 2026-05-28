import styled from "styled-components";

interface AlertItem {
    id: number;
    content: string;
    date: string;
}

interface TemperatureProps {
    trustScore?: number;
}

const Temperature = ({ trustScore = 50.0 }: TemperatureProps) => {
    const tempAlert: AlertItem[] = [
        { id: 1, content: "'감성일기' 프로젝트 지원자 3명", date: "2024-05-03T10:00:00Z" },
        { id: 2, content: "'블록체인 dApp 개발' 프로젝트에 새로운 댓글이 달렸습니다.", date: "2024-05-03T11:30:00Z" },
        { id: 3, content: "포트폴리오 신뢰도가 2.5°C 상승했습니다!", date: "2024-05-02T15:20:00Z" },
        { id: 4, content: "모집 분야 'Front'인 새로운 인기 프로젝트가 등록되었습니다.", date: "2024-05-02T09:00:00Z" },
    ];

    const getTimeInfo = (date: string) => {
        const now = new Date();
        const alertDate = new Date(date);
        const diffInMs = now.getTime() - alertDate.getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        let timeText = "";
        if (diffInMins < 1) timeText = "방금 전";
        else if (diffInMins < 60) timeText = `${diffInMins}분 전`;
        else if (diffInHours < 24) timeText = `${diffInHours}시간 전`;
        else timeText = `${diffInDays}일 전`;

        const opacity = Math.max(0.2, 1 - diffInMs / (1000 * 60 * 60 * 24 * 3));

        return { timeText, opacity };
    };

    return (
        <Wrapper>
            <Title>실시간 알림</Title>

            <TempSection>
                <ProgressBarBackground>
                    <ProgressBarCover $score={trustScore} />
                </ProgressBarBackground>
                <ScoreValue>{trustScore.toFixed(1)}°C</ScoreValue>
                <ScoreLabel>나의 CPU 온도</ScoreLabel>
            </TempSection>

            <AlertList>
                {tempAlert.map(alert => {
                    const { timeText, opacity } = getTimeInfo(alert.date);
                    return (
                        <AlertItemBox key={alert.id}>
                            <StatusCircle $opacity={opacity} />

                            <ContentWrapper>
                                <ContentText>{alert.content}</ContentText>
                                <TimeText>{timeText}</TimeText>
                            </ContentWrapper>
                        </AlertItemBox>
                    );
                })}
            </AlertList>

            <Footer>상세 내역 확인</Footer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 20%;
    height: 800px;
    min-width: 300px;
    background-color: white;
    border-radius: 50px;
    
    padding: 40px 30px; 
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    font-size: 21px;
    font-weight: bold;
    color: var(--color-text, #111827);
    
    margin-bottom: 25px; 
`;

const TempSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
`;

const ProgressBarBackground = styled.div`
    width: 45px;
    height: 180px;
    background: linear-gradient(to top, #B8D6FF, #FFCE53, #FF3E3E);
    border-radius: 30px;
    overflow: hidden;
    margin-bottom: 15px;
    
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

const ProgressBarCover = styled.div<{ $score: number }>`
    height: ${(props) => 100 - Math.min(Math.max(props.$score, 0), 100)}%;
    width: 100%;
    background-color: var(--color-gray, #eeeeee);
    transition: height 0.5s ease-in-out;
`;

const ScoreValue = styled.div`
    font-size: 38px;
    font-weight: bold;
    color: var(--color-text, #111827);
    margin-bottom: 5px;
`;

const ScoreLabel = styled.div`
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text, #111827);
`;

const AlertList = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const AlertItemBox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 15px;
`;

const StatusCircle = styled.div<{ $opacity: number }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(75, 85, 99, ${(props) => props.$opacity});
    flex-shrink: 0;
    margin-top: 5px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

const ContentText = styled.div`
    font-size: 15px;
    color: var(--color-text, #111827);
    line-height: 1.4;
    
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TimeText = styled.div`
    font-size: 13px;
    color: var(--color-text, #9ca3af);
`;

const Footer = styled.div`
    color: var(--color-text);
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    background-color: var(--color-bg);
    width: 100%;
    height: 50px;
    border-radius: 50px;
    
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default Temperature;