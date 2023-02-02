import classNames from "classnames";
import React from "react";

interface CInputTextAreaProps {
  placeholder?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  name?: string;
  required?: boolean;
}
const defaultProps: CInputTextAreaProps = {
  placeholder: "Search Videos...",
  value: "",
};

const CInputTextArea: React.FC<CInputTextAreaProps> = ({
  label,
  onChange,
  value,
  required,
  ...props
}) => {
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
          required={required}
          value={value}
        />
      </div>
    </>
  );
};

CInputTextArea.defaultProps = defaultProps;
export default CInputTextArea;
