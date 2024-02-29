"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useRoutes from "app/utils/useRoutes";
import { useToken } from "app/utils/token";
import { SvgSpinner } from "app/icons/icons";

interface LoginCheckerProps {
  children: ReactNode;
  isLoginPage?: boolean;
}

const LoginChecker: React.FC<LoginCheckerProps> = ({
  children,
  isLoginPage = false,
}) => {
  const router = useRouter();
  const ROUTES = useRoutes();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isValidToken, clearUserLoginResponse } = useToken();

  useEffect(() => {
    if (!isValidToken()) {
      clearUserLoginResponse();
      if (!isLoginPage) {
        router.push(ROUTES.home);
        return;
      }
    } else {
      if (isLoginPage) {
        router.push(ROUTES.menu);
        return;
      }
    }
    setIsLoaded(true);
  }, [isLoaded]);

  if (isLoaded) return <>{children}</>;
  else
    return (
      <div className="items-center justify-center flex-col p-4  h-[800px]">
        <SvgSpinner className="w-full justify-center" />
      </div>
    );
};

export default LoginChecker;
