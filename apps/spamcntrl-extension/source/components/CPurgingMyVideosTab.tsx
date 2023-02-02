import React from "react";
import { AppContext } from "../context";
import { getLatestVideos } from "../store/slices/dashboardSlice";
import CButton from "./CButton";
import CLatestVideos from "./CLatestVideos";

interface CPurgingMyVideosTabProps {}
const defaultProps: CPurgingMyVideosTabProps = {};

const CPurgingMyVideosTab: React.FC<CPurgingMyVideosTabProps> = ({}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext);

  const latestVideos = getLatestVideos();

  return (
    <>
      <CLatestVideos />
      <div className="mt-3 flex justify-center">
        <CButton
          className="w-20"
          buttonStyle={"tab"}
          text="View All"
          onClick={() => {
            setActiveNavbarKey && setActiveNavbarKey("my-videos");
          }}
          disabled={latestVideos && latestVideos.length == 0}
        />
      </div>
    </>
  );
};

CPurgingMyVideosTab.defaultProps = defaultProps;
export default CPurgingMyVideosTab;
