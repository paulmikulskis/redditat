import classNames from "classnames";
import { useState } from "react";
import CButton from "../components/CButton";
import CInput from "../components/CInput";
import CInputTextArea from "../components/CInputTextArea";
import CNavbar from "../components/CNavbar";
import CPage from "../components/CPage";
import CPanel from "../components/CPanel";

export interface IEmailFormData {
  email: string;
  name: string;
  subject: string;
  body: string;
}

export default function ContactUs() {
  const [emailFormData, setEmailFormData] = useState<IEmailFormData>({
    email: "",
    name: "",
    subject: "",
    body: "",
  });

  function onClickContactUs(emailFormData: IEmailFormData) {
    window.location.href = `mailto:contacts@spamcntrl.com?cc=${
      emailFormData.email
    }&subject=${emailFormData.subject}&body=${emailFormData.body.replaceAll(
      "\n",
      "%0D%0A"
    )}%0D%0A%0D%0ARegards,%20${emailFormData.name}`;
  }

  function onChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmailFormData((prev) => {
      return {
        ...prev,
        email: e.target.value,
      };
    });
  }

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setEmailFormData((prev) => {
      return {
        ...prev,
        name: e.target.value,
      };
    });
  }

  function onChangeSubject(e: React.ChangeEvent<HTMLInputElement>) {
    setEmailFormData((prev) => {
      return {
        ...prev,
        subject: e.target.value,
      };
    });
  }

  function onChangeBody(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setEmailFormData((prev) => {
      return {
        ...prev,
        body: e.target.value,
      };
    });
  }

  return (
    <CPage>
      <CPanel className="min-h-[850px]">
        <CNavbar navbarStyle="alt" />

        <div className="flex justify-center mt-[80px]">
          <div className={classNames("px-8 max-w-[900px]", "")}>
            <div className="text-[32px] max-w-[350px] font-bold">
              Love to hear from you, Get in touch
            </div>

            <div className="mt-[32px]">
              <div
                className={classNames(
                  "grid grid-cols-1",
                  "xl:grid-cols-2 xl:space-x-[34px]"
                )}
              >
                <div className={classNames("mb-4", "xl:mb-0")}>
                  <CInput
                    name="name"
                    type="modal"
                    label="Your Name"
                    placeholder="Enter your name here"
                    onChange={onChangeName}
                  />
                </div>
                <div>
                  <CInput
                    name="email"
                    type="modal"
                    label="Your Email"
                    placeholder="Enter your email here"
                    onChange={onChangeEmail}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CInput
                name="subject"
                type="modal"
                label="Subject"
                placeholder="Get a quote / Bugs / Issues"
                onChange={onChangeSubject}
              />
            </div>

            <div className="mt-4">
              <CInputTextArea
                label="Message"
                placeholder="Let us know what you want to say..."
                onChange={onChangeBody}
              />
            </div>

            <div className={classNames("mt-4 flex justify-center", "xl:block")}>
              <CButton
                text="Contact Us"
                buttonStyle="primary"
                onClick={(e) => onClickContactUs(emailFormData)}
              />
            </div>
          </div>
        </div>
      </CPanel>
    </CPage>
  );
}
