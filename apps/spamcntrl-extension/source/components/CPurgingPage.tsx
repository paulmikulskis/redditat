import classNames from "classnames";
import React from "react";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch } from "react-redux";
import { AppContext } from "../context";
import {
  getPurgingActiveButtonTabKey,
  getPurgingButtonTabs,
  getPurgingPurgeVideoSearchText,
  setPurgingActiveButtonTabKey,
} from "../store/slices/purgingSlice";
import { getURL } from "../utils";
import CButton from "./CButton";
import CButtonTabs from "./CButtonTabs";
import CIconButton from "./CIconButton";
import CPlaylistBox from "./CPlaylistBox";
import CPurgingMyVideosTab from "./CPurgingMyVideosTab";
import CPurgingOngoingPurgeTab from "./CPurgingOngoingPurgeTab";
import CPurgingQuickSearchVideo from "./CPurgingQuickSearchVideo";
import CPurgingSchedulePurgeTab from "./CPurgingSchedulePurgeTab";

interface CPurgingPageProps {}
const defaultProps: CPurgingPageProps = {};

const CPurgingPage: React.FC<CPurgingPageProps> = ({}) => {
  const dispatch = useDispatch();

  const purgingActiveButtonTabKey = getPurgingActiveButtonTabKey();
  const purgingPurgeVideoSearchText = getPurgingPurgeVideoSearchText();
  const hasContentPurgeVideoSearchText = purgingPurgeVideoSearchText
    ? purgingPurgeVideoSearchText.trim().length > 0
    : false;

  const { setActiveNavbarKey } = React.useContext(AppContext);

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-bold text-title text-txt">Purge Video</span>
        <span>
          <CButton
            buttonStyle="primary"
            text="Purging History"
            icon={<img src={getURL("assets/icons/rewind.svg")} />}
            onClick={() => {
              console.log("purging history");
              setActiveNavbarKey && setActiveNavbarKey("purging-history");
            }}
          />
        </span>
      </div>

      <CPurgingQuickSearchVideo />

      <div
        key="purging-front"
        className={classNames(hasContentPurgeVideoSearchText && "hidden")}
      >
        <div className="w-full mt-3">
          <CButtonTabs
            tabs={getPurgingButtonTabs()}
            activeTabKey={purgingActiveButtonTabKey}
            onClickTab={(tab) => dispatch(setPurgingActiveButtonTabKey(tab.key))}
          />
        </div>

        {/* My Videos */}
        <div className="mt-3 w-full">
          {purgingActiveButtonTabKey == "my-videos" && <CPurgingMyVideosTab />}
          {purgingActiveButtonTabKey == "schedule-purge" && <CPurgingSchedulePurgeTab />}
          {purgingActiveButtonTabKey == "ongoing-purge" && <CPurgingOngoingPurgeTab />}
        </div>

        {/* Playlists */}
        <div className="mt-3 w-full">
          <div className="w-full flex mb-2 justify-between items-center">
            <span className="font-bold text-title text-txt h-full flex items-center">
              My Playlist - 5
            </span>
            <CIconButton
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey("my-playlist");
              }}
              icon={
                <span className="font-medium text-xsm text-lnk h-full flex items-center">
                  View All Playlist
                </span>
              }
            />
          </div>

          <div className="w-full flex justify-between">
            <CPlaylistBox
              img="https://i.ytimg.com/vi/U3d-gOrBSCY/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDyufPHScTOQWQUXKGA_h7fx-Pnbg"
              title="The Crypto Markets Just Flipped"
              count={5}
            />
            <CPlaylistBox
              img="https://i.ytimg.com/vi/TDLMkCm6_sE/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZRiyPlE9WAY1FqQ7L938ENyT5Aw"
              title="Bitcoin Holders...Short Jim Cramer's Picks With This Inverse ETF"
              count={7}
            />
            <CPlaylistBox
              img="https://i.ytimg.com/vi/dWL8hh_FYQg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnShlwRh7tC5kCWddrpTEJVOuaRw"
              title="Top 5 Crypto To Buy NOW! One I'm BUYING HEAVILY⚠️"
              count={9}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-center items-center">
          <CButton
            buttonStyle="primary"
            text="+ Create Playlist"
            style={{ width: "100px" }}
            onClick={() => {
              setActiveNavbarKey && setActiveNavbarKey("create-playlist");
            }}
          />
        </div>
      </div>
    </div>
  );
};

CPurgingPage.defaultProps = defaultProps;
export default CPurgingPage;
