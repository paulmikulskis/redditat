import classNames from "classnames";
import React from "react";
import { getLatestVideos } from "../store/slices/dashboardSlice";
import CEmptyData from "./CEmptyData";
import CVideoBox from "./CVideoBox";
import CVideoBoxSkeleton from "./CVideoBoxSkeleton";

interface CLatestVideosProps {}
const defaultProps: CLatestVideosProps = {};

const CLatestVideos: React.FC<CLatestVideosProps> = ({}) => {
  const latestVideos = getLatestVideos();

  return (
    <div
      className={classNames(
        "w-full",
        latestVideos && latestVideos.length == 0
          ? ""
          : "grid grid-cols-3 place-items-center"
      )}
    >
      {latestVideos && latestVideos.length == 0 ? <CEmptyData /> : null}

      {latestVideos && latestVideos.length > 0
        ? latestVideos.map((video, i) => {
            const isFirst = i == 0;
            const isLast = latestVideos.length > 1 && latestVideos.length - 1 == i;

            return (
              <span
                key={video.videoID}
                className={classNames(
                  isFirst ? "place-self-start" : "",
                  isLast ? "place-self-end" : ""
                )}
              >
                <CVideoBox
                  img={`https://i.ytimg.com/vi/${video.videoID}/hq720.jpg`}
                  title={video.videoTitle}
                />
              </span>
            );
          })
        : null}
      {latestVideos == undefined ? (
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
        </>
      ) : null}
    </div>
  );
};

CLatestVideos.defaultProps = defaultProps;
export default CLatestVideos;
