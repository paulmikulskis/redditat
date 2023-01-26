import classNames from "classnames";
import React from "react";

interface CInputTextAreaProps {
  placeholder?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
const defaultProps: CInputTextAreaProps = {
  placeholder: "Search Videos...",
};

const CInputTextArea: React.FC<CInputTextAreaProps> = ({ label, onChange, ...props }) => {
  return (
    <>
      {label && <div className="text-lnk text-base mb-2 w-full text-left">{label}</div>}

      <div
        className={classNames(
          "h-auto relative w-full rounded-little bg-white flex flex-col",
          "bg-bgc border border-bgc focus-within:border-primary focus-within:bg-alt"
        )}
      >
        <textarea
          className={classNames(
            "w-full h-full outline-none bg-transparent placeholder:font-[450] text-txt font-bold placeholder:text-lnk",
            "placeholder:text-base px-3 py-[6px]"
          )}
          rows={4}
          {...props}
          onChange={onChange}
        />
      </div>
    </>
  );
};

CInputTextArea.defaultProps = defaultProps;
export default CInputTextArea;
