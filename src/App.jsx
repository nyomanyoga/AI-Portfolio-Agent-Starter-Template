import { useState, useMemo, useEffect } from "react"
import { useTranslation, Trans } from "react-i18next"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import ProjectCard from "./components/ProjectCard"
import ChatbotButton from "./components/ChatbotButton"
import { allProjects, CHATBOT_TEMPLATE, PROFILE, PROJECT_TABS, SITE_TEMPLATE } from "./data"
import { getLocalizedText } from "./utils/localizedContent"

const readStoredString = (key, fallback = "") => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

const readStoredArray = (key) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

export default function App() {
  const { t, i18n } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage || i18n.language;

  const [activeTab, setActiveTab] = useState(() => readStoredString('activeTab', "production"))
  const [selectedTags, setSelectedTags] = useState(() => readStoredArray('selectedTags'))
  const [selectedCompanies, setSelectedCompanies] = useState(() => readStoredArray('selectedCompanies'))
  const [searchQuery, setSearchQuery] = useState(() => readStoredString('searchQuery'))
  const [modalData, setModalData] = useState({ isOpen: false, projectTitle: "" });

  useEffect(() => {
    try {
      localStorage.setItem('activeTab', activeTab);
      localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
      localStorage.setItem('selectedCompanies', JSON.stringify(selectedCompanies));
      localStorage.setItem('searchQuery', searchQuery);
    } catch {
      // Ignore storage failures and keep UI functional.
    }
  }, [activeTab, selectedTags, selectedCompanies, searchQuery]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = SITE_TEMPLATE.siteTitle;
    }
  }, []);

  const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '2.0.0';
  const lastUpdatedTime = typeof __APP_UPDATE_TIME__ !== 'undefined' ? __APP_UPDATE_TIME__ : new Date().toISOString();
  const activeTabConfig = PROJECT_TABS.find((tab) => tab.id === activeTab) || PROJECT_TABS[0];
  const hasContactLink = Boolean(PROFILE.contactHref);
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCompanies([]);
  };

  // Koleksi metadata unik (Tags & Companies)
  const { availableTags, availableCompanies } = useMemo(() => {
    const tags = new Set();
    const companies = new Set();
    
    allProjects.forEach(p => {
      p.tags?.forEach(tag => tags.add(tag));
      if (p.companyKey?.trim()) companies.add(p.companyKey);
    });

    return {
      availableTags: [...tags].sort(),
      availableCompanies: [...companies].sort()
    };
  }, []);

  // Filter Global
  const filteredData = useMemo(() => {
    return allProjects.filter(p => {
      const searchLower = searchQuery.toLowerCase();
      
      const translatedTitle = getLocalizedText(p.title, activeLanguage).toLowerCase();
      const translatedDesc = getLocalizedText(p.description, activeLanguage).toLowerCase();
      const translatedCompany = t(p.companyKey).toLowerCase();

      const matchesSearch = !searchQuery || 
        translatedTitle.includes(searchLower) ||
        translatedDesc.includes(searchLower) ||
        translatedCompany.includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower));

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => p.tags.includes(tag));

      const matchesCompanies = selectedCompanies.length === 0 || 
        selectedCompanies.includes(p.companyKey);

      return matchesSearch && matchesTags && matchesCompanies;
    });
  }, [activeLanguage, searchQuery, selectedTags, selectedCompanies, t]);

  const counts = useMemo(() => {
    const initialCounts = Object.fromEntries(PROJECT_TABS.map((tab) => [tab.id, 0]));

    return filteredData.reduce((accumulator, project) => {
      accumulator[project.category] = (accumulator[project.category] || 0) + 1;
      return accumulator;
    }, initialCounts);
  }, [filteredData]);

  const displayProjects = useMemo(() => {
    return filteredData
      .filter(p => p.category === activeTab)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredData, activeTab]);

  const cardAnimationKey = useMemo(() => {
    return [
      activeTab,
      i18n.language,
      searchQuery,
      selectedTags.join('|'),
      selectedCompanies.join('|'),
      displayProjects.length
    ].join('::');
  }, [activeTab, i18n.language, searchQuery, selectedTags, selectedCompanies, displayProjects.length]);

  const handlePrimaryContact = () => {
    if (!PROFILE.contactHref) return;

    window.open(PROFILE.contactHref, "_blank");
    setModalData({ isOpen: false, projectTitle: "" });
  };

  return (
    <div className="app-container">
      <Sidebar counts={counts} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-area">
        <Topbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          availableTags={availableTags}
          selectedCompanies={selectedCompanies}
          setSelectedCompanies={setSelectedCompanies}
          availableCompanies={availableCompanies}
          lastUpdated={lastUpdatedTime} 
        />
        
        <h1 className="title">
          {t(activeTabConfig.titleKey)}
        </h1>

        <div className="grid">
          {displayProjects.map((p, i) => (
            <ProjectCard 
              key={`${cardAnimationKey}-${p.id}`}
              index={i}
              project={p} 
              onPrivateClick={(title) => setModalData({ isOpen: true, projectTitle: title })} 
            />
          ))}
        </div>

        {displayProjects.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>{t('misc.no_results')}</p>
            <button className="reset-btn" onClick={resetFilters}>
              {t('misc.reset_filter')}
            </button>
          </div>
        )}
      </div>

      {modalData.isOpen && (
        <div className="modal-overlay" onClick={() => setModalData({ isOpen: false, projectTitle: "" })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-shield-alt modal-icon"></i>
              <h2>{t('modal.title')}</h2>
            </div>
            <p>
              <Trans i18nKey="modal.desc" values={{ title: modalData.projectTitle }}>
                Project <strong>{modalData.projectTitle}</strong> is private.
              </Trans>
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModalData({ isOpen: false, projectTitle: "" })}>
                {t('modal.close')}
              </button>
              {hasContactLink && (
                <button className="btn-confirm" onClick={handlePrimaryContact}>
                  <i className="fas fa-paper-plane"></i> {t('modal.contact')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-left">© {new Date().getFullYear()} {SITE_TEMPLATE.footerLabel}.</div>
        <div className="footer-version">v{appVersion}</div>
      </footer>
      
      {CHATBOT_TEMPLATE.enabled && <ChatbotButton />}
    </div>
  )
}
