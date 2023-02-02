import classNames from "classnames";
import React, { useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch } from "react-redux";
import { AppContext } from "../context";
import useGetAllVideos from "../hooks/useGetAllVideos";
import {
  getMyVideosSearchResults,
  getMyVideosSearchText,
  setMyVideosSearchText,
} from "../store/slices/myVideosSlice";

import { getURL, searchByVideoNameOrLink } from "../utils";
import CEmptyData from "./CEmptyData";
import CIconButton from "./CIconButton";
import CInput from "./CInput";
import CSearchIcon from "./CSearchIcon";
import CVideoBox from "./CVideoBox";
import CVideoBoxSkeleton from "./CVideoBoxSkeleton";

interface CMyVideosPageProps {}
const defaultProps: CMyVideosPageProps = {};

const CMyVideosPage: React.FC<CMyVideosPageProps> = ({}) => {
  const dispatch = useDispatch();

  const { setActiveNavbarKey } = React.useContext(AppContext);

  const myVideosSearchText = getMyVideosSearchText();
  const myVideosSearchResults = getMyVideosSearchResults();

  const filteredSearchResults = myVideosSearchResults
    ? myVideosSearchResults.filter((video) => {
        if (video) {
          return searchByVideoNameOrLink(
            video.videoTitle,
            video.videoID,
            myVideosSearchText
          );
        } else {
          return false;
        }
      })
    : myVideosSearchResults;

  useEffect(() => {
    dispatch(setMyVideosSearchText(""));
  }, []);
  useGetAllVideos({ deps: [] });

  return (
    <div>
      <div className="flex justify-between">
        <span className="flex items-center h-full">
          <span className="mr-2 flex items-center h-full">
            <CIconButton
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey("purging");
              }}
              icon={<img src={getURL("assets/icons/arrow-back.svg")} />}
            />
          </span>
          <span className="font-bold text-title text-txt flex items-center h-full">
            My Videos - {filteredSearchResults ? filteredSearchResults.length : ""}
          </span>
        </span>
      </div>

      <div className="mt-3 flex">
        <CInput
          onChange={(e) => dispatch(setMyVideosSearchText(e.target.value))}
          icon={<CSearchIcon />}
          value={myVideosSearchText}
          placeholder={"Search videos..."}
        />
      </div>

      {/* My Videos */}
      <div
        className={classNames(
          "my-3 w-full",
          filteredSearchResults && filteredSearchResults.length == 0
            ? ""
            : "grid grid-cols-3 gap-[9px]"
        )}
      >
        {filteredSearchResults && filteredSearchResults.length == 0 ? (
          <CEmptyData />
        ) : null}

        {filteredSearchResults == undefined ? (
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

        {filteredSearchResults && filteredSearchResults.length > 0
          ? filteredSearchResults.map((video) => {
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
  );
};

CMyVideosPage.defaultProps = defaultProps;
export default CMyVideosPage;
