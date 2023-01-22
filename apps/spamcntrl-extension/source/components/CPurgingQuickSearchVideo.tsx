import classNames from "classnames";
import React from "react";
import { useDispatch } from "react-redux";
import useGetAllVideos from "../hooks/useGetAllVideos";
import { getMyVideosSearchResults } from "../store/slices/myVideosSlice";
import {
  getPurgingPurgeVideoSearchText,
  setPurgingPurgeVideoSearchText,
} from "../store/slices/purgingSlice";
import { searchByVideoNameOrLink } from "../utils";
import CEmptyData from "./CEmptyData";
import CInput from "./CInput";
import CSearchIcon from "./CSearchIcon";
import CVideoBox from "./CVideoBox";
import CVideoBoxSkeleton from "./CVideoBoxSkeleton";

interface CPurgingQuickSearchVideoProps {}
const defaultProps: CPurgingQuickSearchVideoProps = {};

const CPurgingQuickSearchVideo: React.FC<CPurgingQuickSearchVideoProps> = () => {
  const dispatch = useDispatch();

  const purgingPurgeVideoSearchText = getPurgingPurgeVideoSearchText();
  const hasContentPurgeVideoSearchText = purgingPurgeVideoSearchText
    ? purgingPurgeVideoSearchText.trim().length > 0
    : false;

  //video search on purging tab
  useGetAllVideos({
    deps: [purgingPurgeVideoSearchText],
    cond: purgingPurgeVideoSearchText.trim().length > 0,
  });
  const myVideosSearchResults = getMyVideosSearchResults();

  const filteredMyVideosSearchResults = myVideosSearchResults
    ? myVideosSearchResults.filter((video) => {
        if (video) {
          return searchByVideoNameOrLink(
            video.videoTitle,
            video.videoID,
            purgingPurgeVideoSearchText
          );
        } else {
          return false;
        }
      })
    : myVideosSearchResults;

  function onChangePurgingPurgeVideoSearchText(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setPurgingPurgeVideoSearchText(e.target.value));
  }

  return (
    <>
      <div className="mt-3">
        <CInput
          onChange={onChangePurgingPurgeVideoSearchText}
          icon={<CSearchIcon />}
          value={purgingPurgeVideoSearchText}
          placeholder={"Search videos for purging..."}
        />
      </div>

      {/* Front Page */}
      <div
        key="purging-search-purge-video"
        className={classNames("w-full mt-3", !hasContentPurgeVideoSearchText && "hidden")}
      >
        <div className="w-full flex mb-2 justify-between items-center">
          <span className="font-bold text-title text-txt h-full flex items-center">
            Search Results -{" "}
            {filteredMyVideosSearchResults ? filteredMyVideosSearchResults.length : ""}
          </span>
        </div>
        <div
          className={classNames(
            "w-full",
            filteredMyVideosSearchResults && filteredMyVideosSearchResults.length == 0
              ? ""
              : "grid grid-cols-3 gap-[9px]"
          )}
        >
          {filteredMyVideosSearchResults && filteredMyVideosSearchResults.length == 0 ? (
            <CEmptyData />
          ) : null}

          {filteredMyVideosSearchResults == undefined ? (
            <>
              <span className="place-self-start">
                <CVideoBoxSkeleton />
              </span>
              <span>
                <CVideoBoxSkeleton />
              </span>
              <span className="place-self-end">
                <CVideoBoxSkeleton />
              </span>
              <span className="place-self-start">
                <CVideoBoxSkeleton />
              </span>
              <span>
                <CVideoBoxSkeleton />
              </span>
              <span className="place-self-end">
                <CVideoBoxSkeleton />
              </span>
              <span className="place-self-start">
                <CVideoBoxSkeleton />
              </span>
              <span>
                <CVideoBoxSkeleton />
              </span>
              <span className="place-self-end">
                <CVideoBoxSkeleton />
              </span>
            </>
          ) : null}

          {filteredMyVideosSearchResults && filteredMyVideosSearchResults.length > 0
            ? filteredMyVideosSearchResults.map((video) => {
                return (
                  <CVideoBox
                    key={video.videoID}
                    img={`https://i.ytimg.com/vi/${video.videoID}/hq720.jpg`}
                    title={video.videoTitle}
                  />
                );
              })
            : null}
        </div>
      </div>
    </>
  );
};

CPurgingQuickSearchVideo.defaultProps = defaultProps;
export default CPurgingQuickSearchVideo;
