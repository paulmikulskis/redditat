import classNames from "classnames";
import CNavbar from "../components/CNavbar";
import CPage from "../components/CPage";
import CPanel from "../components/CPanel";

import { privacyPolicy } from "../html";

import { useComponentDidMount } from "../hooks/useComponentDidMount";

export interface IPrivacyPolicyPageProps {
  privacyPolicy: string;
}

export async function getServerSideProps() {
  return {
    props: {
      privacyPolicy,
    } as IPrivacyPolicyPageProps, // will be passed to the page component as props
  };
}

export default function MyStats({ privacyPolicy }: IPrivacyPolicyPageProps) {
  const [mounted] = useComponentDidMount();

  return (
    <CPage>
      <CPanel className="min-h-[500px]">
        <CNavbar navbarStyle="alt" />

        <div className="flex justify-center mt-[80px]">
          <div className={classNames("px-8 max-w-[900px]", "")}>
            <div className="text-lnk text-base w-full text-left pb-[100px]">
              {mounted ? (
                <div
                  className="privacy-policy"
                  dangerouslySetInnerHTML={{
                    __html: privacyPolicy,
                  }}
                ></div>
              ) : null}
            </div>
          </div>
        </div>
      </CPanel>
    </CPage>
  );
}
