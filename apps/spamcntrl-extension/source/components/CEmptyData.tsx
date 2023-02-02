import React from "react";
import { getURL } from "../utils";

export interface CEmptyDataProps {
  style?: object;
  title?: string;
  img?: string;
}
const defaultProps: CEmptyDataProps = {
  title: "No Videos Found",
  img: "assets/images/nodata.png",
};

const CEmptyData: React.FC<CEmptyDataProps> = ({ style, title, img }) => {
  return (
    <div
      className="h-[124px] flex flex-col justify-center items-center relative"
      style={style}
    >
      {img ? <img className="h-[100px]" src={getURL(img)} /> : null}
      <span className="absolute font-bold text-[20px] text-[#aaa5ff]">{title}</span>
    </div>
  );
};

CEmptyData.defaultProps = defaultProps;
export default CEmptyData;
