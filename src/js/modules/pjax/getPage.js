export default function(pageId, page) {
  switch (pageId) {
    case 'index':
      return page.index;
    case 'intro':
      return page.intro;
    case 'creativeStudio':
      return page.creativeStudio;
    case 'strategyWard':
      return page.strategyWard;
    case 'starAgency':
      return page.starAgency;
    default:
      return page.blank;
  }
}
