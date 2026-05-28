import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    const user = useAuthStore((state) => state.user);

    const nickname = user?.nickname || '게스트';
    const trustScore = Number(user?.cpu ?? 50.0);

    return(
        <Container>
            <Menu>
                <Title onClick={() => navigate('/')}>meet.u</Title>
                <Buttons>
                    <MenuButton $isActive={path === '/'} onClick={() => navigate('/')}>
                        홈
                    </MenuButton>
                    <MenuButton $isActive={path === '/projects'} onClick={() => navigate('/projects')}>
                        프로젝트 찾기
                    </MenuButton>
                    <MenuButton $isActive={path === '/projects/new'} onClick={() => navigate('/projects/new')}>
                        프로젝트 등록
                    </MenuButton>
                    <MenuButton $isActive={path.startsWith('/portfolio')} onClick={() => navigate('/portfolio')}>
                        포트폴리오 관리
                    </MenuButton>
                    <MenuButton $isActive={path === '/mypage'} onClick={() => navigate('/mypage')}>
                        마이페이지
                    </MenuButton>
                    <MenuButton $isActive={path === '/project/management'} onClick={() => navigate('/project/management')}>
                        프로젝트 관리
                    </MenuButton>
                </Buttons>
            </Menu>

            <ProfileSection>
                <ProfileImage />
                <ProfileInfo>
                    <Nickname>{nickname}</Nickname>

                    <TemperatureContainer>
                        <TemperatureText>{trustScore.toFixed(1)}°C</TemperatureText>
                        <ProgressBarBackground>
                            <ProgressBarFill $score={trustScore} />
                        </ProgressBarBackground>
                    </TemperatureContainer>
                </ProfileInfo>
            </ProfileSection>
        </Container>
    )
}

const Container = styled.div`
    min-width: 270px;
    height: 720px;
    background-color: white;
    border-radius: 50px;

    margin: 30px 0 30px 30px;
    padding: 30px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Menu = styled.div``

const Title = styled.div`
    font-size: 35px;
    font-family: var(--font-logo),serif;
    color: var(--color-primary);
    margin-bottom: 20px;
    cursor: pointer;
`

const Buttons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const MenuButton = styled.div<{ $isActive: boolean }>`
    width: calc(100% - 30px);
    height: 50px;
    border-radius: 50px;

    background-color: ${(props) => props.$isActive ? 'var(--color-l-accent)' : 'var(--color-gray)'};
    color: ${(props) => props.$isActive ? '#ffffff' : '#000000'};
    font-weight: ${(props) => props.$isActive ? 'bold' : 'normal'};

    padding-left: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        opacity: 0.8;
    }
`

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`

const ProfileImage = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: var(--color-gray);
    flex-shrink: 0;
`

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const Nickname = styled.div`
    font-weight: bold;
    font-size: 16px;
`

const TemperatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
`

const TemperatureText = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: var(--color-primary);
`

const ProgressBarBackground = styled.div`
    width: 100%;
    height: 10px;
    background: linear-gradient(to right, #B8D6FF, #FFCE53, #FF3E3E);
    border-radius: 4px;
    overflow: hidden;

    display: flex;
    justify-content: flex-end;
`

const ProgressBarFill = styled.div<{ $score: number }>`
    width: ${(props) => 100 - Math.min(Math.max(props.$score, 0), 100)}%;
    height: 100%;
    background-color: var(--color-gray);
    transition: width 0.5s ease-in-out;
`

export default SideBar;