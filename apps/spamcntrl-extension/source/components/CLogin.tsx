import React from "react";
import { useDispatch } from "react-redux";
import { IRuntimeResponse } from "../models";
import { setLoader } from "../store/slices/appSlice";
import { getURL, hasYoutubeAuth, login_google, openLink } from "../utils";
import { getAuthYoutubeURL, newUser, viewUser } from "../utils/api";
import CButton from "./CButton";

interface CLoginProps {
  onChangeAuth?: (res: IRuntimeResponse) => void;
}
const defaultProps: CLoginProps = {};

const CLogin: React.FC<CLoginProps> = ({ onChangeAuth }) => {
  const dispatch = useDispatch();

  async function _login_google() {
    dispatch(
      setLoader({
        show: true,
        title: "Logging in with google.",
      })
    );

    const login_google_res = await login_google();

    if (login_google_res.status == "success") {
      console.log("log: login_google_res", login_google_res);
      const user = login_google_res.message;
      dispatch(
        setLoader({
          show: true,
          title: "Checking if account is already created...",
        })
      );
      if (user && user.uid) {
        alert(`user.uid = ${user.uid}`);
        const userDB = await viewUser(user.uid);
        alert(`userDB.id = ${userDB.id}\nuser.uuid = ${userDB.uuid}`);
        let getYoutubeAuth = false;
        if (userDB) {
          if (!hasYoutubeAuth(userDB)) {
            getYoutubeAuth = true;
          }
        } else {
          dispatch(
            setLoader({
              show: true,
              title: "Creating new user account...",
            })
          );
          await newUser(user);
          getYoutubeAuth = true;
        }

        if (getYoutubeAuth) {
          dispatch(
            setLoader({
              show: true,
              title: "Allow youtube to modify your youtube channel...",
            })
          );

          const youtubeAuthUrl = await getAuthYoutubeURL(userDB.uuid ?? "");
          await openLink(youtubeAuthUrl);
        }
      }
    }

    onChangeAuth && onChangeAuth(login_google_res);
  }

  return (
    <div className="c-login p-4">
      <div
        className="bg-alt h-full rounded"
        style={{
          paddingTop: "102px",
        }}
      >
        <div className="w-ful flex justify-center items-center mb-8">
          <img src={getURL("assets/images/login_illus.svg")} />
        </div>
        <div className="w-ful flex items-center justify-center">
          <h2 className="text-xl font-bold text-txt">Welcome to SpamCntrl</h2>
        </div>

        <div className="mt-4 w-full flex items-center justify-center">
          <CButton
            style={{
              width: "150px",
              height: "32px",
            }}
            buttonStyle="primary"
            onClick={_login_google}
            icon={
              <svg
                className="w-4 h-4 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
              >
                <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z" />
              </svg>
            }
            text="Log In with Google"
          />
        </div>
      </div>
    </div>
  );
};

CLogin.defaultProps = defaultProps;
export default CLogin;
