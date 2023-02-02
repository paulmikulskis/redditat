import classNames from "classnames";
import CButton from "../components/CButton";
import CFooter from "../components/CFooter";
import CInput from "../components/CInput";
import CInputTextArea from "../components/CInputTextArea";
import CNavbar from "../components/CNavbar";
import CPage from "../components/CPage";
import CPanel from "../components/CPanel";

export default function About() {
  return (
    <CPage>
      <CPanel className="min-h-[750px]">
        <CNavbar navbarStyle="alt" />

        <div className="flex justify-center mt-[80px]">
          <div className={classNames("px-8 max-w-[900px]", "")}>
            <div className="text-[32px] max-w-[350px] font-bold">About Us</div>

            <div className="text-lnk text-base w-full text-left pb-[100px]">
              <p className="mt-[32px]">
                At SpamCntrl, we are on a mission to create a better and spam-free
                internet for all. Our founders, Parth and Paul, had a personal experience
                with the detrimental effects of spam on their own YouTube channel and
                decided to take action. They saw firsthand the frustration and time it
                took to combat the constant flood of spam comments and knew that something
                had to be done.
              </p>
              <br />
              <p>
                Determined to put an end to this problem, Parth and Paul assembled a team
                of like-minded individuals who shared their passion for creating a better
                online experience. Together, they put in countless hours of hard work,
                developing a cutting-edge spam filtering technology specifically for
                YouTube. Our technology not only combats spam but destroys it once and for
                all, giving content creators the freedom to focus on creating and sharing
                quality content without the fear of it being drowned out by spam.
              </p>
              <br />
              <p>
                But our vision doesn't stop at YouTube, we look forward to expanding our
                technology to other platforms to combat spam on a larger scale. We
                understand that spam is a problem that affects not only content creators
                but also viewers, as scammers may use spam to steal money from them.
              </p>
              <br />
              <p>
                We believe that everyone should have the opportunity to create and share
                content without the fear of it being drowned out by spam. Our mission is
                to empower creators and give them the tools they need to take control of
                their online presence. We believe that together, we can create a better
                and spam-free internet for all.
              </p>
              <br />
              <p>
                We take pride in our work, and strive to inspire others to believe that
                anything is possible with hard work, determination and a team that shares
                the same vision. Join us in our mission to create a better internet for
                all.
              </p>
            </div>
          </div>
        </div>
      </CPanel>
    </CPage>
  );
}
