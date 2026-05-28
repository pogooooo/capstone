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
    padding: 60px 80px;
    gap: 40px;
`;

export const HeaderSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 10px;
`;

export const MainTitle = styled.h1`
    font-size: 36px;
    font-weight: 900;
    margin: 0;
`;

export const SubTitle = styled.div`
    font-size: 16px;
    color: var(--color-caption);
    font-weight: 600;
`;

export const SectionCard = styled.div`
    background-color: white;
    border-radius: 50px;
    padding: 50px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    gap: 25px;
`;

export const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

export const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: 800;
    margin: 0;
`;

export const RowGroup = styled.div`
    display: flex;
    gap: 30px;
    width: 100%;
`;

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
`;

export const Label = styled.label`
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text);
    margin-left: 5px;
`;

const InputBaseStyle = `
    width: 100%;
    padding: 18px 25px;
    border-radius: 30px;
    border: 1px solid var(--color-gray);
    background-color: #fafafa;
    font-size: 15px;
    color: var(--color-text);
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s, background-color 0.2s;

    &:focus {
        border-color: var(--color-text);
        background-color: white;
    }
    
    &::placeholder {
        color: #bbb;
    }
`;

export const StyledInput = styled.input`
    ${InputBaseStyle}
`;

export const StyledSelect = styled.select`
    ${InputBaseStyle};
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 20px top 50%;
    background-size: 12px auto;
`;

export const StyledTextarea = styled.textarea`
    ${InputBaseStyle};
    min-height: 200px;
    resize: vertical;
    line-height: 1.6;
`;

export const TechStackContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
`;

export const TechBadge = styled.div<{ $isActive: boolean }>`
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    
    background-color: ${props => props.$isActive ? 'var(--color-text)' : 'var(--color-gray)'};
    color: ${props => props.$isActive ? 'white' : 'var(--color-text)'};

    &:hover {
        transform: translateY(-2px);
        background-color: ${props => props.$isActive ? 'var(--color-text)' : '#e0e0e0'};
    }
`;

export const AddButton = styled.div`
    font-size: 15px;
    font-weight: 800;
    color: white;
    background-color: var(--color-text);
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

export const PositionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

export const PositionCard = styled.div`
    position: relative;
    background-color: #fafafa;
    border: 1px solid var(--color-gray);
    border-radius: 30px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: var(--color-l-accent);
    }
`;

export const PositionRole = styled.div`
    font-size: 20px;
    font-weight: 800;
    text-align: left;
    color: var(--color-text);
`;

export const PositionDesc = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: var(--color-caption);
    text-align: left;
    line-height: 1.5;
`;

export const PositionCountBadge = styled.div`
    position: absolute;
    top: 25px;
    right: 25px;
    background-color: var(--color-l-accent);
    color: white;
    font-size: 13px;
    font-weight: 800;
    padding: 6px 14px;
    border-radius: 20px;
`;

export const DeletePosBtn = styled.div`
    font-size: 13px;
    color: #ff4d4f;
    font-weight: 700;
    cursor: pointer;
    align-self: flex-start;
    margin-top: 5px;
`;

export const SubmitSection = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    margin-bottom: 50px;
`;

export const SubmitButton = styled.button`
    padding: 20px 50px;
    border-radius: 40px;
    background-color: var(--color-text);
    color: white;
    font-size: 18px;
    font-weight: 900;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    &:disabled {
        background-color: var(--color-gray);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

export const ModalContent = styled.div`
    background-color: white;
    width: 500px;
    border-radius: 40px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h3`
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 30px 0;
`;

export const ModalButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 35px;
`;

export const ModalButton = styled.div<{ $variant: 'primary' | 'cancel' }>`
    padding: 12px 25px;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    
    background-color: ${props => props.$variant === 'primary' ? 'var(--color-text)' : 'var(--color-gray)'};
    color: ${props => props.$variant === 'primary' ? 'white' : 'var(--color-text)'};
    
    transition: opacity 0.2s;
    &:hover {
        opacity: 0.8;
    }
`;