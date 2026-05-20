/* eslint-disable react/no-unescaped-entities */
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FALLBACK_AVATAR_IMAGE, getAvatarImageUrl } from "../utils/images";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    setSearchTerm(searchTermFromUrl || "");
  }, [location.search]);

  return (
    <header className="sticky top-0 z-50 bg-slate-200 px-4 shadow-md sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 py-3">
        <Link to="/" className="shrink-0">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Avet's</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 px-3 py-2 sm:p-3 rounded-lg flex flex-1 max-w-xs sm:max-w-sm md:max-w-md items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none min-w-0 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="p-1 text-slate-600 hover:text-amber-700">
            <FaSearch />
          </button>
        </form>
        <ul className="flex shrink-0 items-center gap-3 sm:gap-4">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="text-slate-700 hover:underline">
            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={getAvatarImageUrl(currentUser.avatar)}
                  alt="profile"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_AVATAR_IMAGE;
                  }}
                />
              ) : (
                "Sign in"
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
