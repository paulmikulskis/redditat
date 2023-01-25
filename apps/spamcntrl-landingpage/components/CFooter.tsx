import classNames from "classnames";
import Link from "next/link";
import React from "react";
import CIconLink from "./CIconLink";
import CPanel from "./CPanel";

export interface CFooterProps {
  isHome?: boolean;
}
const defaultProps: CFooterProps = {
  isHome: false,
};

const CFooter: React.FC<CFooterProps> = ({ isHome }) => {
  return (
    <CPanel
      style={{
        background: "linear-gradient(180deg, #ECE7FF 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <div
        className={classNames(
          "px-8 grid grid-cols-1 space-y-8",
          "xl:flex xl:justify-between xl:pl-[104px] xl:pr-[101px] xl:space-y-0",
          isHome ? "pt-[302px]" : "pt-[151px]"
        )}
      >
        <div
          className={classNames("grid grid-cols-1 place-items-center", "xl:inline-block")}
        >
          <div className="font-semibold text-[34.06px] leading-[34.35px] text-txt font-poppins mt-[-30px] mb-[-30px]">
            {/* <img src="logo/horizontal-logo.svg" width="290px" /> */}
            <img src="logo/horizontal-logo.png" className="h-[100px]" />
          </div>
          <div
            className={classNames(
              "mt-[19px] max-w-[350px] font-normal text-base leading-[30px] text-lnk text-center",
              "xl:text-left"
            )}
          >
            This is a big one and i consider it one of the most important things for a
            designer.
          </div>
        </div>

        <div
          className={classNames("grid grid-cols-1 place-items-center", "xl:inline-block")}
        >
          <div className="mb-5 font-medium text-[18px] leading-[26px] text-txt">
            Quick Links
          </div>
          <div className="cursor-pointer font-normal text-base leading-[19.2px] text-lnk">
            <Link href="/">Home</Link>
          </div>
          <div className="cursor-pointer mt-[15px] font-normal text-base leading-[19.2px] text-lnk">
            Features
          </div>
        </div>

        <div
          className={classNames("grid grid-cols-1 place-items-center", "xl:inline-block")}
        >
          <div className="mb-5 font-medium text-[18px] leading-[26px] text-txt">
            Company
          </div>
          <div className="cursor-pointer font-normal text-base leading-[19.2px] text-lnk">
            <Link href="/about">About</Link>
          </div>
          <div className="cursor-pointer mt-[15px] font-normal text-base leading-[19.2px] text-lnk">
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div
          className={classNames("grid grid-cols-1 place-items-center", "xl:inline-block")}
        >
          <div className="mb-5 font-medium text-[18px] leading-[26px] text-txt">
            Information
          </div>
          <div className="cursor-pointer font-normal text-base leading-[19.2px] text-lnk">
            Privacy Policy
          </div>
          <div className="cursor-pointer mt-[15px] font-normal text-base leading-[19.2px] text-lnk">
            Terms & Condition
          </div>
          <div className="cursor-pointer mt-[15px] font-normal text-base leading-[19.2px] text-lnk">
            FAQ
          </div>
        </div>
      </div>

      <div className="mt-[124px]">
        <div className="w-full border-t border-t-[#D5CEED] border-opacity-40 rounded-[1px]"></div>
        <div className="pt-[23px] pb-[21px] flex justify-center font-normal text-[18px] leading-[24px] text-lnk">
          Copyright © 2022 SpamCntrl
        </div>
      </div>
    </CPanel>
  );
};

CFooter.defaultProps = defaultProps;
export default CFooter;
