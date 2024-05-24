import React from "react";
import {
  Gmail,
  Instagram,
  LinkedIn,
  Logo,
} from "../../assets/imports/importImages";
import { Link } from "react-router-dom";

const Footer = () => {
  const socialLinks = [
    { label: "Bisariyon", icon: Logo },
    { label: "Gmail", icon: Gmail },
    { label: "Instagram", icon: Instagram },
    { label: "LinkedIn", icon: LinkedIn },
  ];

  const links = [
    {
      heading: "Company",
      items: [
        { label: "About Us", url: "/#" },
        { label: "Contact Us", url: "/#" },
      ],
    },
    {
      heading: "Support",
      items: [
        { label: "FAQ", url: "/#" },
        { label: "Terms of Service", url: "/#" },
      ],
    },
  ];

  return (
    <div className="bottom-0 left-0 right-0 font-poppins cursor-default">
      <div className="py-16 px-12 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 bg-gray-900 text-white w-full relative ">
        <div className="">
          <div className="footer-img flex items-center">
            <img src={Logo} alt="" className="w-20 h-auto" />{" "}
            <span className="text-4xl font-bold pl-3 text-white font-serif">
              Bisariyon E-com
            </span>
          </div>
          <div className="infos text-gray-200 my-2">
            <span>Copyright © 2024 Nexcent ltd.</span>
            <span>All rights reserved</span>
          </div>
          <div className="footer-icons flex items-center space-x-3 my-4 py-2">
            {socialLinks.map((socialLink, index) => {
              const Icon = socialLink.icon;
              return (
                <Link
                  key={`social-${index}`}
                  to="#"
                  rel="noopener noreferrer"
                >
                  <img
                    src={Icon}
                    alt={socialLink.label}
                    className="w-16 h-16 p-2 rounded-full bg-green-700 hover:bg-white cursor-pointer"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mx-2 grid w-full py-5 sm:py-0 grid-cols-2 ">
          {links.map((col, index) => {
            return (
              <ul className={`col col-${index + 1}`} key={`col-${index}`}>
                <li className="text-2xl text-white font-bold mb-2">
                  {col.heading}
                </li>
                {col.items.map((link, index) => {
                  return (
                    <li
                      key={`link-${col}-${index}`}
                      className={`text-gray-400 cursor-pointer ${
                        link.key === "header-1" || link.key === "header-2"
                          ? "text-2xl text-white"
                          : ""
                      }`}
                    >
                      <Link to={link.url}>{link.label}</Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
        <div className="footer-form flex flex-col  ">
          <label className="text-lg font-semibold text-te">
            Stay up to date
          </label>
          <input
            type="email"
            placeholder="Subscribe to our email"
            className="mt-2 w-full border-none rounded-lg py-3 px-6 text-gray-800 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-100 transition duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
