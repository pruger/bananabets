"use client";
import { Link } from "@nextui-org/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import activate_apemode_gif from "@/public/activate_apemode.gif";
import activate_apemode from "@/public/activate_apemode.png";


const Navbar: React.FC = () => {
  const [startApemode, setStartApemode] = useState(false);
  const [raindropTimeout, setRaindropTimeout] =
    useState<NodeJS.Timeout | null>();
  const { setTheme } = useTheme();

  const createRaindrop = () => {
    var raindrop = document.createElement("div");

    raindrop.className = "raindrop";
    // Set random size
    var sizes = [8, 16, 32];
    var size = sizes[Math.floor(Math.random() * sizes.length)];

    raindrop.style.width = size + "px";
    raindrop.style.height = size + "px";

    // Set random position
    raindrop.style.left = Math.random() * window.innerWidth + "px";
    raindrop.style.top = -size + "px";

    // Set random animation duration
    raindrop.style.animationDuration = 2 + Math.random() * 3 + "s";

    document.getElementById("apeBackground")?.appendChild(raindrop);

    // Remove raindrop after animation ends
    raindrop.addEventListener("animationiteration", function () {
      document.getElementById("apeBackground")?.removeChild(raindrop);
    });
  };

  useEffect(() => {
    const backgroundMusic = document.getElementById(
      "backgroundMusic",
    ) as HTMLAudioElement;

    if (startApemode) {
      setTheme("dark");
      backgroundMusic.play();
      setRaindropTimeout(setInterval(createRaindrop, 200));
    } else {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      clearInterval(raindropTimeout as NodeJS.Timeout);
      document.querySelectorAll(".raindrop").forEach(function (raindrop) {
        raindrop.remove();
      });
      setTheme("light");
    }
  }, [startApemode]);

  return (
    <div className="flex flex-col justify-center items-center m-3">
      <audio loop id="backgroundMusic">
        <source src="apemode.mp3" type="audio/mp3" />
        <track kind="captions" />
        Your browser does not support the audio element.
      </audio>
      <Image
        alt="GorillaGamble"
        className="object-cover rounded-xl cursor-pointer"
        src={startApemode ? activate_apemode_gif : activate_apemode}
        width={450}
        onClick={() => setStartApemode(!startApemode)}
      />
      <span>
        <Link href="/" size="lg">
          Voting
        </Link>{" "}
        ·{" "}
        <Link href="/leaderboard" size="lg">
          Leaderboard
        </Link>
      </span>
    </div>
  );
};

export default Navbar;
