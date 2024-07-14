"use client";
import { useMediaQuery } from "react-responsive";
import { ReactNode, useEffect, useState } from "react";

interface MobileOnlyAppProps {
  children: ReactNode;
}

const MobileOnlyApp: React.FC<MobileOnlyAppProps> = ({ children }) => {
//     const [isMobile, setIsMobile] = useState(true);
//     useEffect(() => {
//     	let hasTouchScreen = false;
// 		try {
// 			var UA = navigator.userAgent;

// 			hasTouchScreen = (
// 				/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
// 				/\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
// 			);
// 			console.log("hasTouchScreen", hasTouchScreen);
// 			setIsMobile(hasTouchScreen);
//     } catch (e) {}
//   }, []);

  return (<>
	<div className="block md:hidden">
	  {children}
	</div>

	<div className="hidden md:flex flex-col items-center">
		<h1 className="text-2xl font-bold text-center text-red-600">Desktop Detected</h1>
		<p className="text-center mt-4 text-red-600">This site is intended for mobile devices only. Please visit us on a mobile device for the best experience.</p>
	</div>
  </>);
};

export default MobileOnlyApp;
