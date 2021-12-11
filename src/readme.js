import adult from './adult';
import main from './main';
import { requiredScripts } from './externals';

const sites = [...main, ...adult];
const languages = [...new Set(sites.flatMap((s) => s.languages))];

const linkSite = (site) => `[${site[0]}](${site[1]})`;
const normalizeSite = (site) => {
  if (typeof site.name !== 'string') return [[site.name || '', site.homepage || '']];
  return [[site.name, site.homepage]];
};

function siteListEntry(site) {
  const links = (s) => normalizeSite(s).map(linkSite).join(' / ');
  const lang = site.language === undefined ? '' : ` _[${site.language}]_`;
  const obs = site.obs === undefined ? '' : ` **Obs: ${site.obs}**`;
  return `- ${links(site)}${lang}${obs}`;
}

const sortSites = (ss) => [...ss].sort((a, z) => {
  if (a.language > z.language) return 1;
  if (a.language.toString() === z.language.toString() && a.name > z.name) return 1;
  return 0;
});
const sitesList = (ss) => sortSites(ss).map(siteListEntry).join('\n');

const mangaSites = sitesList(main.filter((s) => s.category === 'manga'));
const comicSites = sitesList(main.filter((s) => s.category === 'comic'));
const hentaiSites = sitesList(adult);
const bookmarklet = `${requiredScripts.join('", "')}`;

export {
  mangaSites,
  comicSites,
  hentaiSites,
  languages,
  bookmarklet,
};
