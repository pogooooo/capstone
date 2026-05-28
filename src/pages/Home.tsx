import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

import WelcomeModal from "../components/modal/WelcomeModal.tsx";
import SideBar from "../components/SideBar.tsx";
import PopularProject from "../components/Home/PopularProject.tsx";
import Temperature from "../components/Home/Temperature.tsx";

const Home = () => {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const logout = useAuthStore((state) => state.logout);

    const [isModalClosed, setIsModalClosed] = useState(false);

    const { data: portfolio, isError, error } = useQuery({
        queryKey: ['portfolio', user?.id],
        queryFn: async () => {
            const response = await axios.get('http://localhost:3000/api/portfolio', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        },
        enabled: !!accessToken,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const isPortfolioMissing = isError && axios.isAxiosError(error) && error.response?.status === 404;

    const showModal = isPortfolioMissing && !isModalClosed;

    const handleCloseModal = () => {
        setIsModalClosed(true);
    };

    const trustScore = portfolio?.trust_score ?? 50.0;

    return (
        <Container>
            <SideBar />

            <ContentContainer>
                <Banner></Banner>
                <button onClick={logout}>로그아웃</button>
                <Content>
                    <PopularProject />
                    <Temperature trustScore={trustScore} />
                </Content>
            </ContentContainer>

            {showModal && (
                <WelcomeModal onClose={handleCloseModal}/>
            )}
        </Container>
    );
};

const Container = styled.div`
    background-color: var(--color-bg);
    width: 100%;
    display: flex;
    //overflow-x: hidden;
`;

const ContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Banner = styled.div`
    width: 90%;
    height: 400px;
    border-radius: 50px;
    background-color: white;
`

const Content = styled.div`
    display: flex;
    width: 90%;
`

export default Home;