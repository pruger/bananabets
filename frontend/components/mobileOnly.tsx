import { useMediaQuery } from "react-responsive";
import { ReactNode } from "react";

interface MobileOnlyAppProps {
  children: ReactNode;
}

const MobileOnlyApp: React.FC<MobileOnlyAppProps> = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 600 });

  return isMobile ? (
    <>{children}</>
  ) : (
    <div>
      <h4>This application is only available on mobile devices.</h4>
    </div>
  );
};

export default MobileOnlyApp;
