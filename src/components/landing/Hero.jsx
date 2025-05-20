import { Link } from "react-router-dom"
import "../../styles/landing/hero.css"

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Proteja sua empresa contra <span className="text-gradient">ameaças digitais</span> na dark web
          </h1>
          <p className="hero-description">
            Monitoramento avançado e em tempo real de vazamentos de dados, credenciais e informações sensíveis em
            fóruns, marketplaces e sites da dark web.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Comece agora
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
            <Link to="/login" className="btn btn-outline">
              Fazer login
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-text">Taxa de detecção</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-text">Monitoramento</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-text">Clientes satisfeitos</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-container">
            <img src="/images/hero-dashboard.png" alt="Dashboard DeepProtexion" className="dashboard-image" />
            <div className="floating-card card-1">
              <div className="card-icon">🔒</div>
              <div className="card-content">
                <div className="card-title">Vazamento detectado</div>
                <div className="card-progress">
                  <div className="progress-bar"></div>
                </div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🛡️</div>
              <div className="card-content">
                <div className="card-title">Proteção ativa</div>
                <div className="card-status">Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-shape">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="var(--background-secondary)"
          ></path>
        </svg>
      </div>
    </section>
  )
}

export default Hero
