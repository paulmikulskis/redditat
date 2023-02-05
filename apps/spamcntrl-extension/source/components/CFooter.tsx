import React from "react";
import { IUser } from "../models";
import { getURL, openLink } from "../utils";
import CIconButton from "./CIconButton";

interface CFooterProps {
  user?: IUser | null;
  onClickLogout?: () => void;

  activeNavBarKey?: string | null;
}
const defaultProps: CFooterProps = {
  activeNavBarKey: "home",
  user: null,
};

const CFooter: React.FC<CFooterProps> = ({}) => {
  function onClickWebsiteLink() {
    openLink("https://spamcntrl.com/", { active: true });
  }

  return (
    <div className="fixed bottom-0 c-footer bg-alt w-full text-sm text-lnk flex justify-between items-center px-4 font-[450]">
      <CIconButton icon={<span onClick={onClickWebsiteLink}>spamcntrl.com</span>} />
      <CIconButton
        icon={
          <span className="flex items-center h-full">
            <img
              src={getURL("assets/icons/bug.svg")}
              style={{
                marginRight: "3px",
              }}
            />{" "}
            <span style={{ lineHeight: "10px" }}>Report a Bug</span>
          </span>
        }
      />
    </div>
  );
};

CFooter.defaultProps = defaultProps;
export default CFooter;
