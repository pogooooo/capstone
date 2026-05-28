import styled from "styled-components";
import { IoClose } from "react-icons/io5";

interface WelcomeModalProps {
    onClose: () => void;
}

const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
    return(
        <ModalOverlay>
            <Modal>
                <CloseIconWrapper onClick={onClose}>
                    <IoClose size={32} />
                </CloseIconWrapper>

                <ModalContent>
                    <Title>welcome! meet.u</Title>
                    <SubTitle>가입 완료!</SubTitle>
                    <Content>이제 나만의 프로필과 포트폴리오를 작성하고<br/>프로젝트를 시작해보세요</Content>
                    <Button>프로필 및 포트폴리오 작성하러 가기</Button>
                </ModalContent>
            </Modal>
        </ModalOverlay>
    )
}

const ModalOverlay = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
`

const Modal = styled.div`
    position: relative;
    width: 550px;
    height: 350px;
    background-color: var(--color-bg-sub);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const CloseIconWrapper = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.7;
    }
`;

const ModalContent = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`

const Title = styled.div`
    font-family: var(--font-logo);
    font-size: 48px;
    color: var(--color-primary);
    margin-bottom: 10px;
`

const SubTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 10px;
`

const Content = styled.div`
    font-size: 16px;
    color: var(--color-primary);
    text-align: center;
    margin-bottom: 30px;
`

const Button = styled.div`
    width: 350px;
    height: 50px;
    border-radius: 60px;
    background-color: var(--color-l-accent);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    font-weight: bold;
`

export default WelcomeModal;