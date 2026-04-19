const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Capstone API',
        description: '캡스톤 프로젝트 API 명세서',
    },
    host: 'localhost:3000',
    schemes: ['http'],

    tags: [
        {
            name: 'auth',
            description: '인증 및 유저 프로필 관리 API'
        },
        {
            name: 'Portfolio',
            description: '유저 포트폴리오 관리 API'
        },
        {
            name: 'Projects',
            description: '프로젝트 팀 빌딩 및 참가 관리 API'
        }
    ],

    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
        },
    },
};

const outputFile = './swagger-output.json'; // 자동으로 만들어질 파일 이름
const routes = ['./app.js']; // 라우터가 연결된 메인 파일(app.js)을 지정하면 안의 경로를 다 추적합니다.

swaggerAutogen(outputFile, routes, doc);