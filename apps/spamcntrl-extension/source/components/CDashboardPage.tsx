import React from "react";
import CLatestVideos from "./CLatestVideos";
import CPurgingOverview from "./CPurgingOverview";

interface CDashboardPageProps {}
const defaultProps: CDashboardPageProps = {};

const CDashboardPage: React.FC<CDashboardPageProps> = ({}) => {
  return (
    <div className="max-w-md w-full">
      <CPurgingOverview />

      <div className="mt-3 w-full">
        <div className="w-full flex mb-3">
          <span className="font-bold text-title text-txt leading-[18px]">
            Latest Videos
          </span>
        </div>
        <CLatestVideos />
      </div>
    </div>
  );
};

CDashboardPage.defaultProps = defaultProps;
export default CDashboardPage;
