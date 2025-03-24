export type PageTitle =
  | "Home"
  | "About"
  | "Project"
  | "Team_members"
  | "Blog"
  | "Contact"
  | "Contribution"

export type NavCategory =
  | "Project"
  | "Wet Lab"
  | "Dry Lab"
  | "Team"
  | "Human Practices";

/**
 * Home などナビゲーションに表示される際に SubPages を持たないもの
 */
export type SinglePageConfigEntry = { title: PageTitle; url: string };

/**
 * Dry などナビゲーションに表示される際に カテゴリー内に subPages が表示されるもの
 */
export type CategoricalPagesConfigEntry = {
  title: NavCategory;
  subPages: {
    title: PageTitle;
    url: string;
  }[];
};

export type CategoricalSubPagesConfigEntry ={
  Subtitle: PageTitle[];
}

export type NavConfigEntry =
  | SinglePageConfigEntry
  | CategoricalPagesConfigEntry;

/**
 * configuration of navigation for pages
 */
export const navConfig: Array<NavConfigEntry> = [
  { title: "Home", url: "/" },
  { title: "About", url: "/about/"},
  {title: "Project",url: "/project/"},
  {title: "Team_members",url: "/teammembers/"},
  {title: "Blog",url: "/blog/"},
  {title: "Contact",url: "/contact/"},
  {title: "Contribution",url: "/contribution/"}
    
];
