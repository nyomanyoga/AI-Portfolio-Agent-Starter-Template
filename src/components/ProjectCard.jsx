import { useTranslation } from 'react-i18next';
import { formatDate } from "../utils/formatters";
import { getLocalizedText } from '../utils/localizedContent';

export default function ProjectCard({ project, onPrivateClick, index = 0 }) {
  const { t, i18n } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage || i18n.language;
  const title = getLocalizedText(project.title, activeLanguage);
  const description = getLocalizedText(project.description, activeLanguage);
  const isPublicProject = Boolean(project.link);

  return (
    <div className="card" style={{ '--card-index': index }}>
      <img src={project.image} alt={title} />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <h4 className="card-company">{t(project.companyKey)}</h4>
        <p className="card-desc">{description}</p>
        
        <div className="card-date-row">
          <span className="date-tag">
            <i className="far fa-calendar-alt"></i>
            {formatDate(project.date)}
          </span>
        </div>
        
        <div className="tech-tags-row">
          {project.tags.map((tag, i) => (
            <span key={`${project.id}-${tag}-${i}`} className="tech-tag">{tag}</span>
          ))}
        </div>

        <div className="card-action-row">
          {isPublicProject ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-status btn-public">
              <i className="fas fa-external-link-alt"></i> {t('common.public_btn')}
            </a>
          ) : (
            <button className="btn-status btn-private" onClick={() => onPrivateClick(title)}>
              <i className="fas fa-lock"></i> {t('common.private_btn')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
