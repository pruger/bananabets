import { Link } from "@nextui-org/link";

import { title } from "./primitives";

import { siteConfig } from "@/config/site";

const Navbar: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center m-3">
      <div className="inline-block max-w-lg text-center">
        <h1 className={title({ color: "violet" })}>{siteConfig.name}</h1>
        <br />
        <span>websites regardless of your design experience.</span>
      </div>
      <span>
        <Link href="/">Voting</Link> · <Link href="/leaderboard">Leaderboard</Link>
      </span>
    </div>
  );
};

export default Navbar;
