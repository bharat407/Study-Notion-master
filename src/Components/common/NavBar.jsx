import React, { useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef } from "react";
import { HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router";

const NavBar = ({ setProgress }) => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const matchRoutes = (routes) => {
    return matchPath({ path: routes }, location.pathname);
  };

  const [sublinks, setsublinks] = useState([]);
  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      if (result?.data?.data?.length > 0) {
        setsublinks(result?.data?.data);
      }
      localStorage.setItem("sublinks", JSON.stringify(result.data.data));
    } catch (error) {
      // setsublinks(JSON.parse(localStorage.getItem("sublinks")));
      // console.log("could not fetch sublinks",localStorage.getItem("sublinks"));
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSublinks();
  }, []);

  const show = useRef();
  const overlay = useRef();

  const shownav = () => {
    if (show.current) {
      show.current.classList.toggle("translate-x-full");
      show.current.classList.toggle("translate-x-0");
    }
    if (overlay.current) {
      overlay.current.classList.toggle("invisible");
      overlay.current.classList.toggle("opacity-0");
      overlay.current.classList.toggle("opacity-100");
    }
  };

  //handeling navbar scroll
  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > prevScrollPos) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handelSearch = (e) => {
    e.preventDefault();
    if (searchValue?.length > 0) {
      navigate(`/search/${searchValue}`);
      setSearchValue("");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-richblack-900 border-b-[1px] border-b-richblack-700 h-14 z-50">
      <div className="flex w-11/12 max-w-maxContent mx-auto items-center justify-between h-full">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => dispatch(setProgress(100))}
          className="flex-shrink-0"
        >
          <img
            src={logo}
            alt="Study Notion"
            className="w-[130px] md:w-[160px] h-auto"
          />
        </Link>

        {/* Mobile Cart Icon */}
        {user && user?.accountType !== "Instructor" && (
          <div className="block md:hidden">
            <Link
              to="/dashboard/cart"
              onClick={() => dispatch(setProgress(100))}
              className="relative p-2"
            >
              <TiShoppingCart className="w-7 h-7 fill-richblack-25" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-100 text-richblack-900 text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Mobile Hamburger */}
        <div className="md:hidden relative">
          <button
            onClick={shownav}
            className="p-2 hover:bg-richblack-800 rounded-lg transition-all duration-200"
          >
            <GiHamburgerMenu className="w-6 h-6 fill-richblack-25" />
          </button>

          {/* Mobile Menu Overlay */}
          <div
            ref={overlay}
            onClick={shownav}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300"
          />

          {/* Mobile Menu */}
          <div
            ref={show}
            className="fixed right-0 top-0 w-[270px] h-screen bg-richblack-900 translate-x-full transition-transform duration-300 ease-in-out overflow-y-auto"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Close Button */}
              <button
                onClick={shownav}
                className="absolute top-4 right-4 p-2 hover:bg-richblack-800 rounded-lg"
              >
                <svg className="w-6 h-6 fill-richblack-25" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>

              {/* Mobile Auth Buttons */}
              {token == null && (
                <div className="space-y-3 mt-8">
                  <Link
                    to="/login"
                    onClick={() => {
                      dispatch(setProgress(100));
                      shownav();
                    }}
                  >
                    <button className="w-full py-3 px-4 bg-yellow-50 hover:bg-yellow-100 text-richblack-900 rounded-lg font-semibold text-sm transition-all duration-200">
                      Login
                    </button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => {
                      dispatch(setProgress(100));
                      shownav();
                    }}
                  >
                    <button className="w-full py-3 px-4 bg-richblack-800 hover:bg-richblack-700 text-richblack-50 rounded-lg font-semibold text-sm transition-all duration-200">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile Profile Dropdown */}
              {token != null && (
                <div className="mt-8">
                  <p className="text-sm text-richblack-50 mb-3">Account</p>
                  <div className="bg-richblack-800 rounded-lg p-2">
                    <ProfileDropDown />
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <nav className="mt-8">
                {/* Catalog Dropdown */}
                <div className="mb-6">
                  <p className="text-lg font-semibold text-yellow-50 mb-4">
                    Courses
                  </p>
                  <div className="space-y-2">
                    {sublinks?.map((element, index) => (
                      <Link
                        key={index}
                        to={`/catalog/${element?.name}`}
                        onClick={() => {
                          dispatch(setProgress(30));
                          shownav();
                        }}
                        className="block py-2 px-3 text-sm text-richblack-25 hover:bg-richblack-800 rounded-lg transition-all duration-200"
                      >
                        {element?.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Other Navigation Links */}
                <div className="space-y-2">
                  {NavbarLinks?.map(
                    (link, index) =>
                      link.title !== "Catalog" && (
                        <Link
                          key={index}
                          to={link.path}
                          onClick={() => {
                            dispatch(setProgress(100));
                            shownav();
                          }}
                          className="block py-2 px-3 text-sm text-richblack-25 hover:bg-richblack-800 rounded-lg transition-all duration-200"
                        >
                          {link.title}
                        </Link>
                      )
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-6 text-richblack-25">
            {NavbarLinks?.map((element, index) => (
              <li key={index}>
                {element.title === "Catalog" ? (
                  <div className="group relative flex items-center cursor-pointer">
                    <p className="flex items-center gap-1">
                      {element.title}
                      <svg
                        className="w-4 h-4 fill-richblack-25 transition-transform duration-200 group-hover:rotate-180"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </p>

                    {/* Desktop Dropdown Menu */}
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] w-[200px] translate-x-[-50%] translate-y-[3em] rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {sublinks?.map((element, index) => (
                        <Link
                          key={index}
                          to={`/catalog/${element?.name}`}
                          onClick={() => dispatch(setProgress(30))}
                          className="block rounded-lg px-4 py-3 hover:bg-richblack-50 transition-all duration-200"
                        >
                          {element?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={element?.path}
                    onClick={() => dispatch(setProgress(100))}
                    className={`transition-all duration-200 hover:text-yellow-50 ${
                      matchRoutes(element?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    {element?.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Cart & Auth */}
        <div className="hidden md:flex items-center gap-x-4">
          {/* Search Bar */}
          <form onSubmit={handelSearch} className="relative">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search"
              className="w-28 py-2 pl-3 pr-10 text-sm text-richblack-50 bg-richblack-700 rounded-full focus:outline-none focus:ring-1 focus:ring-richblack-400 transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <HiSearch className="w-5 h-5 text-richblack-100" />
            </button>
          </form>

          {/* Desktop Cart Icon */}
          {user && user?.accountType !== "Instructor" && (
            <Link
              to="/dashboard/cart"
              onClick={() => dispatch(setProgress(100))}
              className="relative p-2"
            >
              <TiShoppingCart className="w-7 h-7 fill-richblack-25" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-100 text-richblack-900 text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Desktop Auth Buttons */}
          {token == null ? (
            <div className="flex items-center gap-x-3">
              <Link to="/login" onClick={() => dispatch(setProgress(100))}>
                <button className="py-2 px-4 text-sm font-medium text-richblack-100 bg-richblack-800 border border-richblack-700 rounded-lg hover:bg-richblack-700 transition-all duration-200">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => dispatch(setProgress(100))}>
                <button className="py-2 px-4 text-sm font-medium text-richblack-100 bg-richblack-800 border border-richblack-700 rounded-lg hover:bg-richblack-700 transition-all duration-200">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="ml-4">
              <ProfileDropDown />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
