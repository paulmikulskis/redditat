import React, { useState } from "react";
import { AppContext } from "../context";
import CModal, { CModalProps } from "./CModal";
import CPurgingPage from "./CPurgingPage";
import CDashboardPage from "./CDashboardPage";
import CHelpPage from "./CHelpPage";
import CNotificationsPage from "./CNotificationsPage";
import CPurgingHistoryPage from "./CPurgingHistoryPage";
import CMyVideosPage from "./CMyVideosPage";
import CSchedulePurgePage from "./CSchedulePurgePage";
import COngoingPurgePage from "./COngoingPurgePage";
import CMyPlaylistPage from "./CMyPlaylistPage";
import CCreatePlaylistPage from "./CCreatePlaylistPage";
import CSubscriptionPage from "./CSubscriptionPage";
import CPricingPlanPage from "./CPricingPlanPage";
import CSinglePurgePage from "./CSinglePurgePage";
import CTransactionHistoryPage from "./CTransactionHistoryPage";

interface CAuthenticatedProps {}
const defaultProps: CAuthenticatedProps = {};

const CAuthenticated: React.FC<CAuthenticatedProps> = ({}) => {
  const [confirmModalData] = useState<CModalProps>({
    title: "Confirm Payment",
    content: "Are you sure you want to confirm this payment?",
  });

  const { activeNavbarItem } = React.useContext(AppContext);

  function getPages() {
    if (activeNavbarItem) {
      switch (activeNavbarItem.key) {
        case "dashboard":
          return <CDashboardPage />;
        case "purging":
          return <CPurgingPage />;
        case "help":
          return <CHelpPage />;
        case "notifications":
          return <CNotificationsPage />;
        case "purging-history":
          return <CPurgingHistoryPage />;
        case "my-videos":
          return <CMyVideosPage />;
        case "schedule-purge":
          return <CSchedulePurgePage />;
        case "ongoing-purge":
          return <COngoingPurgePage />;
        case "my-playlist":
          return <CMyPlaylistPage />;
        case "create-playlist":
          return <CCreatePlaylistPage />;
        case "subscription":
          return <CSubscriptionPage />;
        case "pricing-plan":
          return <CPricingPlanPage />;
        case "single-purge":
          return <CSinglePurgePage />;
        case "transaction-history":
          return <CTransactionHistoryPage />;
        default:
          return null;
      }
    }

    return null;
  }

  return (
    <div className="pl-4 pr-[7px] mr-[7px] py-3 c-authenticated">
      {getPages()}
      <CModal {...confirmModalData} />
    </div>
  );
};

CAuthenticated.defaultProps = defaultProps;
export default CAuthenticated;
