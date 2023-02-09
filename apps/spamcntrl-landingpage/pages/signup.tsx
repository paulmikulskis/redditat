import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CButton from "../components/CButton";
import CChip from "../components/CChip";
import CNavbar from "../components/CNavbar";
import CPage from "../components/CPage";
import CPanel from "../components/CPanel";
import { useAuth } from "../contexts/AuthContext";
import { getAuthYoutubeURL, newUser } from "../lib/api";
import { setNotifData } from "../store/slices/appSlice";

export default function MyStats() {
  const { user, login } = useAuth();
  const dispatch = useDispatch();

  function onClickLogin() {
    login()
      .then((user) => {
        //create firestore account
        newUser(user)
          .then((res) => {
            dispatch(
              setNotifData({
                type: "success",
                message:
                  "Congratulations! Your account is now in the care of our dedicated team of professionals.",
              })
            );
          })
          .catch((err) => {
            dispatch(
              setNotifData({
                type: "error",
                message:
                  "There seems to be an error in creating your account. Please contact our support team.",
              })
            );
          });
      })
      .catch((err) => {
        dispatch(
          setNotifData({
            type: "error",
            message: err,
          })
        );
      });
  }

  async function onClickLinkYoutubeAccount() {
    if (user) {
      window.open(await getAuthYoutubeURL(user.uid));
    }
  }

  return (
    <CPage>
      <CPanel className="min-h-[500px]">
        <CNavbar navbarStyle="alt" />

        <div className="flex justify-center mt-[80px] flex-col items-center">
          {user == null ? (
            <div className={classNames("px-8", "xl:max-w-[900px]")}>
              <div
                className={classNames(
                  "text-[32px] max-w-[350px] font-bold text-center",
                  "xl:text-left"
                )}
              >
                Sign Up
              </div>

              <div className="mt-[32px]">
                <div
                  className={classNames(
                    "text-lnk text-base mb-2 w-full text-center",
                    "xl:text-left xl:min-w-[300px]"
                  )}
                >
                  Sign up and start protecting your youtube channel.
                </div>
              </div>

              <div className={classNames("mt-4 flex justify-center", "xl:block")}>
                <CButton
                  onClick={onClickLogin}
                  text="Sign Up w/ Google"
                  buttonStyle="primary"
                  style={{ width: "170px" }}
                />
              </div>
            </div>
          ) : (
            <div className={classNames("px-8", "xl:max-w-[900px]")}>
              <div
                className={classNames(
                  "text-[32px] max-w-[350px] font-bold text-center",
                  "xl:text-left"
                )}
              >
                Hello {user.displayName},
              </div>

              <div className="mt-[32px]">
                <div
                  className={classNames(
                    "text-lnk text-base mb-2 w-full text-left",
                    "xl:text-left xl:min-w-[300px]"
                  )}
                >
                  Greetings! We're thrilled you've joined us. Our app is dedicated to
                  purging spam comments, ensuring a clean and enjoyable environment for
                  all users. We hope you find our platform to be both user-friendly and
                  effective in meeting your needs.
                </div>
              </div>

              <div className={classNames("mt-4 flex justify-center", "xl:block")}>
                <CButton
                  onClick={onClickLinkYoutubeAccount}
                  text="Link Youtube Account"
                  buttonStyle="primary"
                  style={{ paddingLeft: "20px", paddingRight: "20px", width: "auto" }}
                />
              </div>
            </div>
          )}
        </div>
      </CPanel>
    </CPage>
  );
}
