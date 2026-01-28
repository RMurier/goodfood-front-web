import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!isAuthenticated) {
    return (
      <div className="home-page">
        <div className="home-container">
          <h1>Bienvenue sur GoodFood</h1>
          <p>Votre plateforme de livraison de repas préférée</p>
          <button className="btn-primary" onClick={() => navigate('/auth')}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Bonjour, {user?.name} !</h1>
        <p>Bienvenue sur GoodFood</p>
        <div className="user-info">
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
