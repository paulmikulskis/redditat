import classNames from "classnames";
import Image from "next/image";
import CButton from "../components/CButton";
import CChip from "../components/CChip";
import CFooter from "../components/CFooter";
import CIconLink from "../components/CIconLink";
import CInstructionBox from "../components/CInstructionBox";
import CInstructions from "../components/CInstructions";
import CNavbar from "../components/CNavbar";
import CPage from "../components/CPage";
import CPanel from "../components/CPanel";
import CPlanCard from "../components/CPlanCard";
import CPricingPlans from "../components/CPricingPlans";
import CReviews from "../components/CReviews";
import CSwitch from "../components/CSwitch";

export default function Home() {
  return (
    <CPage isHome>
      <CPanel className="">
        {/* Background color */}
        <div
          className="w-full h-full absolute -z-10"
          style={{
            background:
              "conic-gradient(from 247.5deg at 59.38% 32.13%, rgb(100, 50, 228) 0deg, rgb(67, 21, 186) 360deg)",
            transform: "rotate(-180deg)",
          }}
        ></div>
        <CNavbar />
        <div
          className={classNames(
            "px-8 w-full grid grid-cols-1 place-items-center pb-[90.36px]",
            "xl:grid-cols-2 xl:place-items-stretch xl:pl-[104px] xl:pr-[40.26px]"
          )}
        >
          <div className={classNames("order-2", "xl:order-1")}>
            <div
              className={classNames(
                "mt-8 max-w-[535px] flex flex-col items-center",
                "xl:h-[216px] xl:mt-[162px] xl:inline-block"
              )}
            >
              <div
                className={classNames(
                  "mt-4 font-bold text-alt text-[32px] leading-[40px] text-center",
                  "xl:text-[64px] xl:leading-[72px] xl:text-left"
                )}
              >
                We make YouTube spam{" "}
                <span className="relative">
                  removal{" "}
                  <img
                    className={classNames(
                      "w-[233.5px] h-[21.37px] absolute left-0 -bottom-2 -z-10",
                      "xl:bottom-0"
                    )}
                    src="/images/removal-01.png"
                  />
                </span>{" "}
                simple.
              </div>

              <CButton
                className="mt-8"
                // text="Download Extension"
                text="Coming Soon"
                style={{
                  borderRadius: "10px",
                  width: "auto",
                  height: "53px",
                  paddingLeft: "34px",
                  paddingRight: "34px",
                }}
                buttonStyle="alt"
              />
            </div>
          </div>
          <Image
            className={classNames("mt-8 order-1", "xl-order-2 xl:mt-[89px]")}
            src={"/images/extension-demo-2.png"}
            alt="Youtube Spam Purge extension demo"
            width={726}
            height={590}
          />
        </div>
      </CPanel>

      <CPanel>
        <div className="pt-[148.02px]">
          <div
            className={classNames(
              "font-medium text-txt text-[36px] flex justify-center leading-[42px] px-8 flex-wrap",
              "xl:leading-[27px]"
            )}
          >
            How
            <span className="text-[#FF6624] mx-2 relative">
              {" "}
              Purge{" "}
              <img
                className="absolute top-0 bottom-0 my-auto -z-10"
                src="/images/how-purge-work.png"
              />
            </span>
            Works
          </div>

          <CInstructions />

          <div className="mt-[80px] flex justify-center">
            <CButton
              buttonStyle={"primary"}
              // text="Get Started"
              text="Coming Soon"
              style={{
                height: "53px",
                width: "auto",
                paddingLeft: "47px",
                paddingRight: "47px",
              }}
            />
          </div>
        </div>
      </CPanel>

      <CPanel>
        <div className="pt-[120.98px]">
          <div
            className={classNames(
              "flex justify-center font-semibold text-txt text-[36px] leading-[44px] px-8 flex-wrap",
              "xl:leading-[62px]"
            )}
          >
            Best{" "}
            <span className="mx-2 relative text-[#FF6624]">
              Plans{" "}
              <img
                className="w-[94.63px] h-[42.32px] top-0 absolute bottom-0 my-auto"
                src="/images/best-plans-foryou.png"
              />
            </span>{" "}
            for You
          </div>

          <CPricingPlans />
        </div>
      </CPanel>

      <CPanel>
        <div className={classNames("pt-[147px] pb-[324px]")}></div>

        <div
          className={classNames(
            "px-8 w-full z-10 bottom-[-166px] absolute",
            "xl:px-[104px]"
          )}
        >
          <div
            className={classNames(
              "rounded-[35px] bg-[#4416BA] min-h-[370px] px-8 py-8 grid grid-cols-1 place-items-center items-center capitalize flex-wrap",
              "xl:px-[72px] xl:flex xl:justify-between xl:py-0"
            )}
          >
            <div
              className={classNames(
                "max-w-[586px] font-semibold text-[32px] leading-[40px] text-alt text-center",
                "xl:text-left xl:text-[48px] xl:leading-[65px]"
              )}
            >
              Start using Purge to make YouTube{" "}
              <span className="relative z-10 inline-block">
                spam removal{" "}
                <img
                  className="absolute left-0 bottom-[-14px] -z-10"
                  src="/images/removal-02.png"
                />
              </span>{" "}
              simple.
            </div>
            <div
              className={classNames(
                "flex flex-wrap mt-8 justify-center flex-col items-center",
                "xl:mt-0 xl:justify-start xl:flex-row"
              )}
            >
              <CButton
                className={classNames("mb-4", "xl:mt-0 xl:mb-0 xl:mr-6")}
                // text="Download"
                text="Coming Soon"
                style={{
                  fontFamily: "Gelion",
                  fontSize: "16px",
                  fontWeight: 500,
                  height: "65px",
                  background: "#fff",
                  color: "#4416BA",
                  width: "auto",
                  paddingLeft: "48px",
                  paddingRight: "48px",
                }}
              />
              <CButton
                text="Learn More"
                style={{
                  fontFamily: "Gelion",
                  fontSize: "16px",
                  fontWeight: 500,
                  width: "174px",
                  height: "65px",
                }}
                buttonStyle="secondary-alt"
              />
            </div>
          </div>
        </div>
      </CPanel>
    </CPage>
  );
}
