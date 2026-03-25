import { useTranslation } from 'react-i18next';
import { PROFILE, PROJECT_TABS } from '../data';

export default function Sidebar({ counts, activeTab, setActiveTab }) {
  const { t, i18n } = useTranslation();
  const hasSidebarLinks = PROFILE.socialLinks.length > 0 || Boolean(PROFILE.resumeHref);

  return (
    <aside className="sidebar">
      <div className="sidebar-top-glow"></div>

      <div className="profile-card">
        <div className="avatar-wrap">
          <img src={PROFILE.avatar} alt={PROFILE.name} className="avatar" />
        </div>
        <h2 className="profile-name">{PROFILE.name}</h2>
        <p className="profile-title">{t('sidebar.role')}</p>
      </div>

      <nav className="menu">
        {PROJECT_TABS.map((tab) => (
          <div
            key={tab.id}
            className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="menu-icon">{tab.icon}</span>
            <div>
              <div className="menu-title">{t(tab.titleKey)}</div>
              <div className="menu-subtitle">{counts[tab.id] || 0} {t(tab.countLabelKey)}</div>
            </div>
          </div>
        ))}
      </nav>

      {/* Language Switcher - Modern & Professional */}
      <div className="language-switcher">
        <button 
          className={`lang-btn ${i18n.language.startsWith('id') ? 'active' : ''}`} 
          onClick={() => i18n.changeLanguage('id')}
        >
          <span className="flag">🇮🇩</span> ID
        </button>
        <button 
          className={`lang-btn ${i18n.language.startsWith('en') ? 'active' : ''}`} 
          onClick={() => i18n.changeLanguage('en')}
        >
          <span className="flag">🇺🇸</span> EN
        </button>
      </div>

      {hasSidebarLinks && (
        <div className="sidebar-socials">
          {PROFILE.socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <i className={link.iconClass}></i>
            </a>
          ))}
          {PROFILE.resumeHref && (
            <a href={PROFILE.resumeHref} target="_blank" rel="noopener noreferrer" className="cv-button">
              <i className="fa-solid fa-file-pdf"></i>
              <span>{t('sidebar.cv_button')}</span>
            </a>
          )}
        </div>
      )}
    </aside>
  )
}
