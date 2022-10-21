import{
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CadastroUserPage from "./pages/CadastroUserPage";
import PatrimonyPage from "./pages/PatrimonyPage";

const AppRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/cadastro" element={<CadastroUserPage />} />
                <Route exact path="/patrimony" element={<PatrimonyPage />} />
                
            </Routes>
        </Router>

    )
}
export default AppRoutes;