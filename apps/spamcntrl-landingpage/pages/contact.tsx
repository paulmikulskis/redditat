import classNames from "classnames";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import CButton from "../components/CButton";
import CInput from "../components/CInput";
import CInputTextArea from "../components/CInputTextArea";
import CNavbar from "../components/CNavbar";
import CPage from "../components/CPage";
import CPanel from "../components/CPanel";
import { useAuth } from "../contexts/AuthContext";
import { sendEmail } from "../lib/api";
import { sendContactUsForm } from "../lib/firebase-utils";
import { setNotifData } from "../store/slices/appSlice";

export interface IContactUsFormData {
  email: string;
  name: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const { firebase } = useAuth();
  const dispatch = useDispatch();

  const defaultFormData = {
    email: "",
    name: "",
    subject: "",
    message: "",
  };
  const [contactUsFormData, setContactUsFormData] =
    useState<IContactUsFormData>(defaultFormData);

  function onClickContactUs(e: React.FormEvent) {
    e.preventDefault();

    Promise.allSettled([
      sendEmail(contactUsFormData),
      sendContactUsForm(firebase, contactUsFormData),
    ]).then((values) => {
      const emailValue = values[0];
      const firestoreValue = values[1];

      if (emailValue.status == "fulfilled" && firestoreValue.status == "fulfilled") {
        setContactUsFormData(defaultFormData);
        dispatch(
          setNotifData({
            type: "success",
            message:
              "Thank you for reaching out! Your message has been successfully sent. We will get back to you as soon as possible.",
          })
        );
      } else {
        if (emailValue.status === "rejected") {
          dispatch(
            setNotifData({
              type: "error",
              message: emailValue.reason,
            })
          );
        }

        if (firestoreValue.status === "rejected") {
          dispatch(
            setNotifData({
              type: "error",
              message: firestoreValue.reason,
            })
          );
        }
      }
    });
  }

  function onChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setContactUsFormData((prev) => {
      return {
        ...prev,
        email: e.target.value,
      };
    });
  }

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setContactUsFormData((prev) => {
      return {
        ...prev,
        name: e.target.value,
      };
    });
  }

  function onChangeSubject(e: React.ChangeEvent<HTMLInputElement>) {
    setContactUsFormData((prev) => {
      return {
        ...prev,
        subject: e.target.value,
      };
    });
  }

  function onChangeMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContactUsFormData((prev) => {
      return {
        ...prev,
        message: e.target.value,
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

            <form onSubmit={onClickContactUs}>
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
                      inputType="modal"
                      label="Your Name"
                      placeholder="Enter your name here"
                      onChange={onChangeName}
                      value={contactUsFormData.name}
                      required
                    />
                  </div>
                  <div>
                    <CInput
                      name="email"
                      inputType="modal"
                      label="Your Email"
                      placeholder="Enter your email here"
                      onChange={onChangeEmail}
                      value={contactUsFormData.email}
                      required
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <CInput
                  name="subject"
                  inputType="modal"
                  label="Subject"
                  placeholder="Get a quote / Bugs / Issues"
                  onChange={onChangeSubject}
                  value={contactUsFormData.subject}
                  required
                />
              </div>

              <div className="mt-4">
                <CInputTextArea
                  label="Message"
                  placeholder="Let us know what you want to say..."
                  onChange={onChangeMessage}
                  value={contactUsFormData.message}
                  name="message"
                  required
                />
              </div>

              <div className={classNames("mt-4 flex justify-center", "xl:block")}>
                <CButton text="Contact Us" buttonStyle="primary" type="submit" />
              </div>
            </form>
          </div>
        </div>
      </CPanel>
    </CPage>
  );
}
