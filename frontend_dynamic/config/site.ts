export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BananaBets",
  description:
    "Betting plattform where ETHGlobal attendees can forecast potential hackathon finalists using showcase data.",
  navItems: [
    {
      label: "Voting",
      href: "/",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
    },
  ],
};
