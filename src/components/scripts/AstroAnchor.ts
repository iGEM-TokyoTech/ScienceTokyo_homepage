/**
 * /tokyotech/ 等 の BASE_URL 周りを調整
 */
export class AstroAnchor {
    static readonly basPath: string = import.meta.env.BASE_URL;
    static isURL = (href: string): boolean => {
      try {
        new URL(href);
        return true;
      } catch {
        return false;
      }
    };
  
    static isAbsPath = (href: string): boolean => {
      return href[0] === "/";
    };
  
    static setBasePathHref(anchorElement: HTMLAnchorElement): void {
      const hrefAttr = anchorElement.getAttribute("href");
      if (hrefAttr !== null) {
        if (!this.isURL(hrefAttr)) {
          if (this.isAbsPath(hrefAttr)) {
            anchorElement.setAttribute("href", this.basPath + hrefAttr.slice(1));
          }
        }
      }
    }
  }