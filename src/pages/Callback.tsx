import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const Callback = () => {
    const { provider } = useParams();
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const fetchToken = async () => {
            if (code && provider) {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/auth/callback/${provider}?code=${code}`
                    );

                    const { access_token, user } = response.data;

                    login(access_token, user);

                    navigate('/', { replace: true });
                } catch (error) {
                    console.error('로그인 에러:', error);
                    alert('로그인에 실패했습니다.');
                    navigate('/login', { replace: true });
                }
            }
        };

        fetchToken();
    }, [code, provider, navigate, login]);

    return <div>로그인 처리 중입니다... 잠시만 기다려주세요.</div>;
};

export default Callback;