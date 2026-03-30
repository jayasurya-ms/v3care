import {
  BuildingStorefrontIcon,
  ChevronDownIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CiViewList } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";
import { MdOutlineLibraryBooks, MdOutlinePayment } from "react-icons/md";
import { RiAdminLine, RiGitRepositoryCommitsLine } from "react-icons/ri";
import { Link, NavLink, useLocation } from "react-router-dom";

const SideNav = ({ openSideNav, setOpenSideNav, isCollapsed }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();
  const [activeMenus, setActiveMenus] = useState({});

  const userType = localStorage.getItem("user_type_id");
  const userName = localStorage.getItem("username");
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-[#001F3F]",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  useEffect(() => {
    const initActiveMenus = {};

    menuItems.forEach((item) => {
      if (item.subMenu) {
        const isActive = item.subMenu.some(
          (subItem) =>
            pathname === subItem.to || pathname.startsWith(subItem.to),
        );

        if (isActive) {
          initActiveMenus[item.text] = true;
        }
      }
    });

    setActiveMenus(initActiveMenus);
  }, []);

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        if (window.innerWidth < 1280) {
          setOpenSideNav(false);
        }
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  useEffect(() => {
    if (window.innerWidth < 1280) {
      setOpenSideNav(false);
    }
  }, [pathname, setOpenSideNav]);

  const menuItems = [
    {
      to: "/home",
      icon: <HomeIcon className="w-5 h-5 text-inherit" />,
      text: "Dashboard",
      title: "Dashboard",
      roles: [
        "user",
        "vendoruser",
        "vendor",
        "viewer",
        "admin",
        "superadmin",
        "operationteam",
        "masteradmins",
      ],
    },
    {
      to: "/today?page=1",
      icon: <MdOutlineLibraryBooks className="w-5 h-5 text-inherit" />,
      text: "Booking",
      title: "Booking",
      roles: [
        "user",
        "viewer",
        "admin",
        "superadmin",
        "operationteam",
        "masteradmins",
      ],
    },
    {
      to: "/quotation-list?page=1",
      icon: <MdOutlineLibraryBooks className="w-5 h-5 text-inherit" />,
      text: "Quotation",
      title: "Quotation",
      roles: [
        "user",
        "viewer",
        "admin",
        "superadmin",
        "operationteam",
        "masteradmins",
      ],
    },
    // {
    //   to: "/amc-booking?page=1",
    //   icon: <MdOutlineLibraryBooks className="w-5 h-5 text-inherit" />,
    //   text: "AMC Booking",
    //   title: "AMC Booking",
    //   roles: [
    //     "user",
    //     "viewer",
    //     "admin",
    //     "superadmin",
    //     "operationteam",
    //     "masteradmins",
    //   ],
    // },
    {
      to: "/customer?page=1",
      icon: <User className="w-5 h-5 text-inherit" />,
      text: "Customer",
      title: "Customer",
      roles: [
        "user",
        "vendoruser",
        "vendor",
        "viewer",
        "admin",
        "superadmin",
        "operationteam",
        "masteradmins",
      ],
    },
    {
      to: "/web-enquiry?page=1",
      icon: <RiGitRepositoryCommitsLine className="w-5 h-5 text-inherit" />,
      text: "Web Inquiries",
      title: "Web Inquiries",
      roles: ["superadmin", "operationteam", "masteradmins"],
    },
    {
      to: "/idealfield-list",
      icon: <CiViewList className="w-5 h-5 text-inherit" />,
      text: "Field Team",
      title: "Field Team",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
    },

    {
      to: "/vendor-list?page=1",
      icon: <BuildingStorefrontIcon className="w-5 h-5 text-inherit" />,
      text: "Vendor",
      title: "Vendor",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
    },
    {
      to: "/pending-payment?page=1",
      icon: <MdOutlinePayment className="w-5 h-5 text-inherit" />,
      text: "Payments",
      title: "Payments",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
    },
    {
      to: "/pending-payment-confirmation?page=1",
      icon: <MdOutlinePayment className="w-5 h-5 text-inherit" />,
      text: "payment Conf. ",
      title: "Payments",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
    },
    {
      to: "/commission-pending?page=1",
      icon: <RiGitRepositoryCommitsLine className="w-5 h-5 text-inherit" />,
      text: "Commission",
      title: "Commission",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
    },
    {
      to: "/notification",
      icon: <IoMdNotificationsOutline className="w-5 h-5 text-inherit" />,
      text: "Notification",
      title: "Notification",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
    },
    {
      to: "/refer-by?page=1",
      icon: <RiAdminLine className="w-5 h-5 text-inherit" />,
      text: "Master",
      title: "Master",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
    },

    {
      to: "#",
      icon: <IoDownloadOutline className="w-5 h-5 text-inherit" />,
      text: "Reports(downloads)",
      title: "Reports(downloads)",
      roles: ["admin", "superadmin", "operationteam", "viewer", "masteradmins"],
      subMenu: [
        {
          to: "/booking-download",
          text: "Booking",
          title: "Booking Download",
        },
        {
          to: "/allBooking-download",
          text: "Payment Summary",
          title: "All Booking Download",
        },
        {
          to: "/vendor-download",
          text: "Vendor",
          title: "Vendor Download",
        },
        {
          to: "/report-vendor-summary-form",
          text: "Vendor Summary",
          title: "Vendor Summary",
        },
        {
          to: "/received-download",
          text: "Received",
          title: "Received Download",
        },
        {
          to: "/pending-download",
          text: "Pending",
          title: "Pending Download",
        },
      ],
    },
  ];

  const roleMap = {
    1: "user",
    2: "vendoruser",
    3: "vendor",
    4: "viewer",
    5: "admin",
    6: "superadmin",
    7: "operationteam",
    8: "masteradmins",
  };

  const getFilteredMenuItems = () => {
    const role = roleMap[userType];

    return role
      ? menuItems.filter((item) =>
          item.text === "Report"
            ? userName === "superadmins"
            : item.roles.includes(role),
        )
      : [];
  };

  const handleItemClick = () => {
    localStorage.removeItem("page-no");
  };

  const isParentActive = (item) => {
    if (!item.subMenu) return false;
    return item.subMenu.some(
      (subItem) => pathname === subItem.to || pathname.startsWith(subItem.to),
    );
  };

  const toggleMenu = (menuName, forceOpen = false) => {
    setActiveMenus((prev) => ({
      ...prev,
      [menuName]: forceOpen ? true : !prev[menuName],
    }));
  };

  const handleSubmenuClick = (parentMenu) => {
    handleItemClick();

    toggleMenu(parentMenu, true);
  };

  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } ${
        isCollapsed ? "xl:w-[5.5rem] w-[272px]" : "w-[272px] xl:w-[272px]"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] rounded-xl transition-all duration-300 ease-in-out xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <img
              src="/velogo.png"
              alt="Logo"
              className={`h-20 ${
                isCollapsed ? "w-12" : "w-full"
              } transition-all duration-300`}
            />
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div
        className={`m-4 overflow-y-auto ${
          isCollapsed
            ? "lg:h-[calc(100vh-200px)] md:h-[calc(100vh-200px)] h-[calc(100vh-200px)]"
            : "lg:h-[calc(100vh-240px)] md:h-[calc(100vh-240px)] h-[calc(100vh-240px)]"
        } custom-scroll`}
      >
        <ul className="mb-4 flex flex-col gap-1">
          {getFilteredMenuItems().map((item) => {
            const hasSubmenu = !!item.subMenu;
            const isParentMenuActive = hasSubmenu && isParentActive(item);
            const isMenuOpen = activeMenus[item.text];

            return (
              <li key={item.to || item.text}>
                {hasSubmenu ? (
                  <div
                    className={
                      isParentMenuActive ? "bg-blue-500/10 rounded-lg" : ""
                    }
                  >
                    <Button
                      variant={isParentMenuActive ? "gradient" : "text"}
                      color="white"
                      title={item.title}
                      className={`flex items-center justify-between px-4 capitalize ${
                        isParentMenuActive ? "bg-blue-500/20" : ""
                      }`}
                      fullWidth
                      onClick={() => toggleMenu(item.text)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`${
                            isParentMenuActive ? "text-blue-400" : ""
                          }`}
                        >
                          {item.icon}
                        </div>
                        {(!isCollapsed || window.innerWidth < 1280) && (
                          <Typography
                            color={isParentMenuActive ? "blue" : "white"}
                            className={`font-medium capitalize ${
                              isParentMenuActive ? "text-blue-400" : ""
                            }`}
                          >
                            {item.text}
                          </Typography>
                        )}
                      </div>
                      {(!isCollapsed || window.innerWidth < 1280) && (
                        <div
                          className={`transition-transform duration-300 ${
                            isMenuOpen ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDownIcon
                            className={`h-4 w-4 ${
                              isParentMenuActive ? "text-blue-400" : ""
                            }`}
                          />
                        </div>
                      )}
                    </Button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="pl-8 py-2 space-y-1">
                        {item.subMenu.map((subItem) => {
                          return (
                            <li key={subItem.to}>
                              <NavLink
                                to={subItem.to}
                                className={({ isActive }) =>
                                  isActive ? "text-blue-500" : ""
                                }
                                onClick={() => handleSubmenuClick(item.text)}
                              >
                                {({ isActive }) => (
                                  <Button
                                    variant={isActive ? "text" : "text"}
                                    color="white"
                                    title={subItem.title}
                                    className={`flex items-center gap-4 px-3 py-2 capitalize rounded-lg ${
                                      isActive
                                        ? "bg-blue-500/20"
                                        : "hover:bg-blue-gray-800"
                                    }`}
                                    fullWidth
                                  >
                                    <div className="w-2 h-2 rounded-full flex-shrink-0">
                                      {isActive && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                      )}
                                    </div>
                                    {(!isCollapsed ||
                                      window.innerWidth < 1280) && (
                                      <Typography
                                        color="inherit"
                                        className={`font-medium capitalize text-sm ${
                                          isActive ? "text-blue-400" : ""
                                        }`}
                                      >
                                        {subItem.text}
                                      </Typography>
                                    )}
                                  </Button>
                                )}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? "text-blue-500" : ""
                    }
                    onClick={handleItemClick}
                  >
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color="white"
                        title={item.title}
                        className={`flex items-center gap-4 px-4 capitalize ${
                          isActive ? "bg-blue-500/20" : ""
                        }`}
                        fullWidth
                      >
                        <div className={`${isActive ? "text-blue-400" : ""}`}>
                          {item.icon}
                        </div>
                        {(!isCollapsed || window.innerWidth < 1280) && (
                          <Typography
                            color="inherit"
                            className={`font-medium capitalize ${
                              isActive ? "text-blue-400" : ""
                            }`}
                          >
                            {item.text}
                          </Typography>
                        )}
                      </Button>
                    )}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {!isCollapsed && (
        <div className="group absolute transition-all duration-300 ease-in-out bottom-4 left-4 right-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm border-l-2 border-r-2 border-red-900 overflow-hidden">
          <div className="flex flex-col items-center gap-2 text-white relative">
            <div className="text-sm font-medium opacity-80">
              Updated : 30-03-2026
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideNav;
