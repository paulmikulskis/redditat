import classNames from "classnames";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CButton from "../components/CButton";
import CChip from "../components/CChip";
import CNavbar from "../components/CNavbar";
import CPage from "../components/CPage";
import CPanel from "../components/CPanel";
import { useAuth } from "../contexts/AuthContext";
import { getAuthYoutubeURL, newUser, viewUser } from "../lib/api";
import { hasYoutubeAuth } from "../lib/html-util";
import { IUser } from "../models/interfaces";
import { setNotifData } from "../store/slices/appSlice";

export default function MyStats() {
  const [hasLinkedAccount, setHasLinkedAccount] = useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const { user, login } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const controller = new AbortController();
      viewUser(user.uid, { signal: controller.signal }).then(async (res) => {
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          if (res.status == 200) {
            const _user = (await res.json()) as IUser;
            if (hasYoutubeAuth(_user)) {
              setHasLinkedAccount(true);
            } else {
              setHasLinkedAccount(false);
            }
            setDisabledButton(false);
          }

          if (res.status != 200) {
            newUser(user)
              .then((res) => {
                dispatch(
                  setNotifData({
                    type: "success",
                    message:
                      "Congratulations! Your account is now in the care of our dedicated team of professionals.",
                  })
                );
                setDisabledButton(false);
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
          }
        } else {
          dispatch(
            setNotifData({
              type: "error",
              message:
                "You have exceeded your rate limit. Please contact the support team.",
            })
          );
        }
      });

      return () => {
        controller.abort();
      };
    }
  }, [user?.uid]);

  function onClickLogin() {
    login().catch((err) => {
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
                {!hasLinkedAccount ? (
                  <CButton
                    onClick={onClickLinkYoutubeAccount}
                    text="Link Youtube Account"
                    buttonStyle="primary"
                    style={{ paddingLeft: "20px", paddingRight: "20px", width: "auto" }}
                    disabled={disabledButton}
                  />
                ) : (
                  <div className="text-green-600">Thank you for joining!</div>
                )}
              </div>
            </div>
          )}
        </div>
      </CPanel>
    </CPage>
  );
}
