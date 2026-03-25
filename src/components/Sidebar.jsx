import { useTranslation } from 'react-i18next';
import { PROFILE, PROJECT_TABS } from '../data';

export default function Sidebar({ counts, activeTab, setActiveTab }) {
  const { t, i18n } = useTranslation();
  const sidebarLinks = [
    {
      key: 'linkedin',
      href: PROFILE.quickLinks?.linkedin,
      label: 'LinkedIn',
      iconClass: 'fa-brands fa-linkedin-in',
      variant: 'square'
    },
    {
      key: 'github',
      href: PROFILE.quickLinks?.github,
      label: 'GitHub',
      iconClass: 'fa-brands fa-github',
      variant: 'square'
    },
    {
      key: 'cv',
      href: PROFILE.quickLinks?.cv,
      label: t('sidebar.cv_button'),
      iconClass: 'fa-solid fa-file-pdf',
      variant: 'wide'
    }
  ].filter((link) => Boolean(link.href));
  const hasSidebarLinks = sidebarLinks.length > 0;

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
          {sidebarLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              className={`sidebar-link ${link.variant}`}
            >
              <i className={link.iconClass} aria-hidden="true"></i>
              {link.variant === 'wide' ? (
                <span className="sidebar-link-label">{link.label}</span>
              ) : (
                <span className="sr-only">{link.label}</span>
              )}
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}
