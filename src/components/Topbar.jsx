import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/formatters";

export default function Topbar({ 
  searchQuery, 
  setSearchQuery, 
  selectedTags, 
  setSelectedTags, 
  availableTags,
  selectedCompanies,
  setSelectedCompanies,
  availableCompanies,
  lastUpdated 
}) {
  const { t } = useTranslation();
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  
  const skillRef = useRef(null);
  const companyRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillRef.current && !skillRef.current.contains(event.target)) setIsSkillOpen(false);
      if (companyRef.current && !companyRef.current.contains(event.target)) setIsCompanyOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleItem = (item, selectedList, setter) => {
    if (selectedList.includes(item)) {
      setter(selectedList.filter(i => i !== item));
    } else {
      setter([...selectedList, item]);
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="update-status">
          <span className="pulse-dot"></span>
          <span className="status-text">
            {t('topbar.last_updated')}: {formatDate(lastUpdated, { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder={t('topbar.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Multi-Select Skills */}
        <div className="multi-filter-wrapper" ref={skillRef}>
          <div 
            className={`filter-trigger ${selectedTags.length > 0 ? 'has-values' : ''}`}
            onClick={() => { setIsSkillOpen(!isSkillOpen); setIsCompanyOpen(false); }}
          >
            <i className="fas fa-brain"></i>
            <span>
              {selectedTags.length === 0 
                ? t('topbar.all_skills', { count: availableTags.length }) 
                : t('topbar.n_skills', { count: selectedTags.length })}
            </span>
            <i className={`fas fa-chevron-${isSkillOpen ? 'up' : 'down'} arrow`}></i>
          </div>

          {isSkillOpen && (
            <div className="filter-dropdown-menu">
              <div className="dropdown-header">{t('topbar.filter_skill')}</div>
              <div className="tags-grid">
                {availableTags.map((tag, idx) => (
                  <div 
                    key={idx} 
                    className={`tag-option ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleItem(tag, selectedTags, setSelectedTags)}
                  >
                    <div className="checkbox">
                      {selectedTags.includes(tag) && <i className="fas fa-check"></i>}
                    </div>
                    {tag}
                  </div>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="dropdown-footer">
                  <button className="reset-filter-btn" onClick={() => setSelectedTags([])}>
                    <i className="fas fa-undo"></i> {t('topbar.reset_skill')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Multi-Select Company / Industry */}
        <div className="multi-filter-wrapper" ref={companyRef}>
          <div 
            className={`filter-trigger ${selectedCompanies.length > 0 ? 'has-values' : ''}`}
            onClick={() => { setIsCompanyOpen(!isCompanyOpen); setIsSkillOpen(false); }}
          >
            <i className="fas fa-building"></i>
            <span>
              {selectedCompanies.length === 0 
                ? t('topbar.all_industries', { count: availableCompanies.length }) 
                : t('topbar.n_industries', { count: selectedCompanies.length })}
            </span>
            <i className={`fas fa-chevron-${isCompanyOpen ? 'up' : 'down'} arrow`}></i>
          </div>

          {isCompanyOpen && (
            <div className="filter-dropdown-menu">
              <div className="dropdown-header">{t('topbar.filter_company')}</div>
              <div className="tags-grid single-col">
                {availableCompanies.map((companyKey, idx) => (
                  <div 
                    key={idx} 
                    className={`tag-option ${selectedCompanies.includes(companyKey) ? 'selected' : ''}`}
                    onClick={() => toggleItem(companyKey, selectedCompanies, setSelectedCompanies)}
                  >
                    <div className="checkbox">
                      {selectedCompanies.includes(companyKey) && <i className="fas fa-check"></i>}
                    </div>
                    {t(companyKey)}
                  </div>
                ))}
              </div>
              {selectedCompanies.length > 0 && (
                <div className="dropdown-footer">
                  <button className="reset-filter-btn" onClick={() => setSelectedCompanies([])}>
                    <i className="fas fa-undo"></i> {t('topbar.reset_company')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}