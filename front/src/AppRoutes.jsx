import{
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CadastroUserPage from "./pages/CadastroUserPage";

const AppRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/cadastro" element={<CadastroUserPage />} />
            </Routes>
        </Router>

    )
}
export default AppRoutes;