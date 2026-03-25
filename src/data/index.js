import production from './production';
import personal from './personal';
import speaker from './speaker';
export { CHATBOT_TEMPLATE, PROFILE, PROJECT_TABS, SITE_TEMPLATE } from './site';

export const allProjects = [...production, ...personal, ...speaker];
