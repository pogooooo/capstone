import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Home from './pages/Home';
import ProjectFind from "./pages/ProjectFind.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import PortfolioEdit from "./pages/PortfolioEdit.tsx";
import MyPageEdit from "./pages/MyPageEdit.tsx";
import ProjectAdd from "./pages/ProjectAdd.tsx";
import ProjectManagement from "./pages/ProjectManagement.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/auth/callback/:provider" element={<Callback />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<ProjectFind />} />
                    <Route path="/projects/new" element={<ProjectAdd />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/portfolio" element={<PortfolioEdit />} />
                    <Route path="/mypage" element={<MyPageEdit />} />
                    <Route path="/project/management" element={<ProjectManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;