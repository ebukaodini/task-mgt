import React, { useEffect } from "react";
import { useStore } from "../models/useStore";
import { useNavigate } from "react-router-dom";
import { Role } from "../models/types";

interface LayoutProps {
  guards?: Role[];
  children: JSX.Element | JSX.Element[];
}

const Layout: React.FC<LayoutProps> = ({ children, guards }) => {
  const { user, signOut } = useStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  useEffect(() => {
    if (user && guards?.length! > 0) {
      const hasGuardAccess = guards!.some((guard) => guard === user.role);

      if (!hasGuardAccess) {
        signOut();
        navigate("/auth");
      }
    }
  }, [guards, navigate, signOut, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-start justify-start w-3/5 min-h-screen container gap-y-5 py-5">
        {/* user profile */}
        {user && (
          <div className="absolute top-5 end-5 bg-gray-200 p-2 rounded flex flex-col gap-y-2">
            <p className="text-xs font-medium text-gray-500">
              {user.firstName} {user.lastName} - {user.role} <br />
              {user.email}
            </p>
            <button
              className="font-semibold text-xs rounded p-1 text-gray-800 bg-gray-300"
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        {children}
      </div>
      <div className="w-full relative flex justify-center ">
        <a
          href="https://github.com/ebukaodini"
          target="_blank"
          rel="noopener noreferrer"
          className="font-normal absolute bottom-2 text-gray-900"
        >
          Github 💚
        </a>
      </div>
    </div>
  );
};

export default Layout;
