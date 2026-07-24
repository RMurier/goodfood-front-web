import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }

        const response = await register({
          name,
          email,
          password,
          confirmPassword,
        });

        if (response.success) {
          navigate('/');
        } else {
          setError(response.message || 'Erreur lors de l\'inscription');
        }
      } else {
        const response = await login({ email, password });

        if (response.success) {
          navigate('/');
        } else {
          setError(response.message || 'Email ou mot de passe incorrect');
        }
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Présentation GoodFood" style={{ backgroundColor: '#ff5a24' }}>
        <div className="burger-illustration" aria-hidden="true"><span className="burger-top" /><span className="burger-line one" /><span className="burger-line two" /><span className="burger-bottom" /></div>
        <div className="auth-visual-copy"><h2>Bon appétit !</h2><p>Commandez vos plats préférés en quelques clics</p></div>
      </section>
      <section className="auth-content">
      <div className="auth-container">
        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleModeChange('register')}
          >
            Inscription
          </button>
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeChange('login')}
          >
            Connexion
          </button>
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1>{mode === 'register' ? 'Bienvenue' : 'Bon retour !'}</h1>
          <p>
            {mode === 'register'
              ? 'Créez votre compte'
              : 'Connectez-vous à votre compte'}
          </p>
        </div>

        {/* Error Message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirmation mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
          )}

          {mode === 'login' && (
            <a href="#" className="forgot-password">
              Mot de passe oublié ?
            </a>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? 'Chargement...'
              : mode === 'register'
              ? 'Créer un compte'
              : 'Se connecter'}
          </button>
        </form>

        {/* Social Login */}
        <div className="auth-social">
          <button className="btn-social btn-apple" disabled={isLoading}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Se Connecter Avec Apple
          </button>

          <button className="btn-social btn-google" disabled={isLoading}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Se Connecter Avec Google
          </button>
        </div>
      </div>
    </section>
    </main>
  );
}

