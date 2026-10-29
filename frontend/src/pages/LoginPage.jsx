import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../App.css';

function LoginPage() {
    const navigate = useNavigate();

    function handleLogin(loggedUser) {
        if (loggedUser.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    }

    return (
        <main className="store">
            <header className="store-header">
                <a href="/" className="brand">
                    TecnoShop <span>Pro</span>
                </a>
            </header>

            <section className="login-page">
                <LoginForm
                    onLogin={handleLogin}
                    onCancel={() => navigate('/')}
                />
            </section>
        </main>
    );
}

export default LoginPage;