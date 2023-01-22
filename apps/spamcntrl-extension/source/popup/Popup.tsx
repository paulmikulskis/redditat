import React, { useEffect } from "react";
import { CAuthenticated, CHeader, CLogin } from "../components";
import CAlert from "../components/CAlert";
import { AppContext } from "../context";
import { IRuntimeResponse, IUser, TStatus, INotifData, ISubscription } from "../models";
import { auth, formatUser, getLogs, hasYoutubeAuth, logout, openLink } from "../utils";
import "./styles.scss";
import { RootState } from "../store/index";
import { useSelector } from "react-redux";
import CLoader from "../components/CLoader";
import {
  hideLoader,
  setLoader,
  getNavbarItems,
  getAllNavbarItems,
} from "../store/slices/appSlice";
import { useDispatch } from "react-redux";
import { getAuthYoutubeURL, lastNVideos, viewUser } from "../utils/api";
import { User } from "firebase/auth";
import ILog from "../models/ILog";
import {
  setPurgeHistories,
  setPurgeHistoryLoading,
} from "../store/slices/purgeHistorySlice";
import CFooter from "../components/CFooter";
import CNavbar from "../components/CNavBar";
import { IDropdownMenuOption } from "../components/CDropdownButton";
import { setLatestVideos } from "../store/slices/dashboardSlice";

interface PopupProps {}
const defaultProps: PopupProps = {};

const Popup: React.FC<PopupProps> = ({}) => {
  const appData = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  const navbarItems = getNavbarItems();
  const allNavbarItems = getAllNavbarItems();

  const dashboardNavItem = navbarItems.find((n) => n.key == "dashboard") || null;

  const [status, setStatus] = React.useState<TStatus | null>(null);
  const [user, setUser] = React.useState<IUser | null>(null);
  const [activeNavbarItem, setActiveNavbarItem] =
    React.useState<IDropdownMenuOption | null>(dashboardNavItem);
  const [notifData, setNotifData] = React.useState<INotifData>({
    type: "info",
    message: "",
  });

  useEffect(() => {
    const latestVideosAC = new AbortController();

    (async function () {
      if (user && user.id) {
        let latestVideos = undefined;

        try {
          await lastNVideos(user.id, 3, { signal: latestVideosAC.signal }).then(
            (videos) => {
              latestVideos = videos;
            }
          );
        } catch (error) {
          latestVideos = undefined;
        } finally {
          dispatch(setLatestVideos(latestVideos));
        }
      }
    })();

    return () => {
      latestVideosAC.abort();
    };
  }, [user?.id]);

  function onChangeAuth(res: IRuntimeResponse) {
    console.log("log: onChangeAuth", res);
    switch (res.type) {
      case "login":
        if (res.status == "success") {
          handleAuthChange(res.message, "authenticated");
          notify({
            type: "success",
            message: "You are now logged in.",
          });
        } else {
          notify({
            type: "error",
            message: "Trouble logging in. Please check your email and password.",
          });
        }
        break;
      case "auth":
        if (res.status == "success") {
          handleAuthChange(res.message, status == null ? "authenticated" : status);
        } else {
          handleAuthChange(null, status == null ? "login" : status);
        }
        break;
      case "logout":
        if (res.status == "success") {
          handleAuthChange(null, "login");
          notify({
            type: "success",
            message: "You have successfully logged out.",
          });
        } else {
          dispatch(hideLoader());
          notify({
            type: "error",
            message: "Error logging out.",
          });
        }
        break;
      case "signup":
        if (res.status == "success") {
          handleAuthChange(res.message, "authenticated");
          notify({
            type: "success",
            message: "You are now logged in.",
          });
        } else {
          notify({
            type: "error",
            message: "Trouble signing up. Please check your email and password.",
          });
        }
        break;
      case "resetPassword":
        if (res.status == "success") {
          handleAuthChange(null, "login");
          notify({
            type: "success",
            message: "Password reset link was sent to your email.",
          });
        } else {
          notify({
            type: "error",
            message: "Error sending password reset.",
          });
        }
        break;
      case "login_google":
        if (res.status == "success") {
          handleAuthChange(res.message, "authenticated");
          notify({
            type: "success",
            message: "You are now logged in.",
          });
        } else {
          dispatch(hideLoader());
          notify({
            type: "error",
            message: res.message.message,
          });
        }
        break;
    }

    return res;
  }

  React.useEffect(() => {
    if (null == status) {
      checkIfLoggedIn();
    }

    return () => {
      _setPurgeHistories(undefined);
    };
  }, []);

  function _setPurgeHistories(data: ILog[] | undefined | null) {
    dispatch(setPurgeHistories(data));
  }

  function _setPurgeHistoryLoading(loading: boolean) {
    dispatch(setPurgeHistoryLoading(loading));
  }

  async function checkIfLoggedIn() {
    dispatch(
      setLoader({
        show: true,
        title: "Checking if user is logged in...",
      })
    );

    const res = await auth().then(onChangeAuth);

    //load inits
    console.log("load init", res);
    if (res.status == "success" && res.type == "auth") {
      const userId = res.message.uid as string;
      if (userId) {
        //get purging history
        _setPurgeHistoryLoading(true);
        getLogs(userId).then((res) => {
          if (res.status == "success") {
            const dataLog = res.message as ILog[];
            _setPurgeHistories(dataLog);
            _setPurgeHistoryLoading(false);
          } else {
            _setPurgeHistories([]);
            _setPurgeHistoryLoading(false);
          }
        });
      }
    }
  }

  async function handleAuthChange(user: User | null, status: TStatus) {
    //get user from firestore

    if (status == "authenticated") {
      dispatch(
        setLoader({
          show: true,
          title: "Loading user from database...",
        })
      );
    }

    const userDB = await viewUser(user?.uid as string);
    setUser(await formatUser(userDB, user));
    setStatus(status);

    if (userDB && userDB.id && !hasYoutubeAuth(userDB)) {
      const youtubeAuthUrl = await getAuthYoutubeURL(userDB.id);
      await openLink(youtubeAuthUrl);
    }

    dispatch(hideLoader());
  }

  function onClickLogout() {
    dispatch(
      setLoader({
        show: true,
        title: "Logging out...",
      })
    );
    logout().then(onChangeAuth);
  }

  function notify(notifData: INotifData) {
    setNotifData({ ...notifData, alertKey: new Date().getTime() });
  }

  function onClickNavbarItem(navbarItem: IDropdownMenuOption) {
    setActiveNavbarItem(navbarItem);
  }

  function setActiveNavbarKey(key: string) {
    if (key == null) {
      setActiveNavbarItem(null);
      return;
    }

    const navbarItem = allNavbarItems.find((navbarItem) => {
      return navbarItem.key == key;
    });

    if (navbarItem) {
      setActiveNavbarItem(navbarItem);
    }
  }

  function setSubscription(subscription: ISubscription) {
    const newUser: IUser = {
      ...user,
      subscription,
    } as IUser;
    setUser(newUser);
  }

  return (
    <AppContext.Provider
      value={{
        status,
        notify,
        user,
        activeNavbarItem,
        setActiveNavbarKey,
        setSubscription,
      }}
    >
      <div className="c-app relative">
        <CHeader user={user} />

        {status == "authenticated" && (
          <CNavbar
            onClickLogout={onClickLogout}
            navbarItems={navbarItems}
            onClickNavbarItem={onClickNavbarItem}
            activeNavBarKey={activeNavbarItem ? activeNavbarItem.key : undefined}
          />
        )}

        {/**Content */}
        {status == "login" && <CLogin onChangeAuth={onChangeAuth} />}
        {status == "authenticated" && <CAuthenticated />}

        <CFooter />
        <CAlert {...notifData} key={notifData.alertKey} />
        <CLoader {...appData.loader} />
      </div>
    </AppContext.Provider>
  );
};

Popup.defaultProps = defaultProps;
export default Popup;
