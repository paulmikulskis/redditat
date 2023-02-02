import React from "react";
import Head from "next/head";
import classNames from "classnames";
import CFooter from "./CFooter";
import CAlert from "./CAlert";
import { getNotifData } from "../store/slices/appSlice";

export interface CPageProps {
  className?: string;
  children?: React.ReactNode;
  isHome?: boolean;
}
const defaultProps: CPageProps = {
  isHome: false,
};

const CPage: React.FC<CPageProps> = ({ className, children, isHome }) => {
  const notifData = getNotifData();

  return (
    <div className={classNames(className, "h-screen w-screen overflow-auto")}>
      <Head>
        <title>SpamCntrl</title>
        <meta name="description" content="We make Youtube spam removal simple." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
      <CAlert {...notifData} key={notifData.alertKey} />
      <CFooter isHome={isHome} />
    </div>
  );
};

CPage.defaultProps = defaultProps;
export default CPage;
