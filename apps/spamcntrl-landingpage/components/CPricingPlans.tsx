import classNames from "classnames";
import React from "react";
import CChip from "./CChip";
import CPlanCard, { CPlanCardProps } from "./CPlanCard";
import CSwitch from "./CSwitch";

export interface CPricingPlansProps {
  pricingPlans?: CPlanCardProps[];
}
const defaultProps: CPricingPlansProps = {
  pricingPlans: [
    {
      planCardStyle: "alt",
      title: <span className="h-[30px]"></span>,
      image: (
        <div className="mt-[88px] mb-[47px] flex justify-center">
          <img className="w-[93.85px] h-[75px]" src={"/images/paper-plane.png"} />
        </div>
      ),
      price: (
        <div className="text-center mt-2">
          <span className="font-semibold text-[48px] leading-[57.59px] text-txt mr-[14px]">
            Free Trial
          </span>
          <span className="font-normal text-[20px] leading-[23.99px] text-primary">
            (5 Videos)
          </span>
        </div>
      ),
      features: ["Try out all the pro features.", "You can purge up to 5 videos."],
      // buttonText: 'Get Started',
      buttonText: "Coming Soon",
      decor: (
        <img
          className="absolute w-[29px] h-[38px] top-[172px] left-[-15px]"
          src="/images/basic-decor.png"
        />
      ),
    },
    {
      planCardStyle: "primary",
      title: "Pro Tier",
      image: (
        <div className="mt-[80px] mb-[40px] flex justify-center">
          <img className="w-[109.51px] h-[90px]" src="/images/helicopter.png" />
        </div>
      ),
      price: (
        <div className="text-center mt-2">
          <span className="font-semibold text-[48px] leading-[57.59px] text-alt">
            $24.99
          </span>
          <span className="font-normal text-[20px] leading-[23.99px] text-[#7D62C0]">
            /month
          </span>
        </div>
      ),
      yearlyPrice: (
        <div className="text-center mt-2">
          <span className="font-semibold text-[48px] leading-[57.59px] text-alt">
            $279.99
          </span>
          <span className="font-normal text-[20px] leading-[23.99px] text-[#7D62C0]">
            /year
          </span>
        </div>
      ),
      features: [
        "Up to 1,000 actions per month to review and moderate comments.",
        "Up to 5 scheduled workflows.",
        "30-day retention of stats and intel.",
      ],
      buttonText: "Coming Soon",
      // buttonText: "Buy Now",
      decor: (
        <span>
          <CChip
            style={{
              borderRadius: "25.82px",
              width: "128px",
              height: "48px",
              fontWeight: 500,
              fontFamily: "Gelion",
              fontSize: "20px",
            }}
            className="bg-[#FF804A] text-[#FFF] absolute left-0 right-0 mx-auto top-[-15px]"
          >
            Popular
          </CChip>
        </span>
      ),
    },
    {
      planCardStyle: "alt",
      title: "Enterprise Tier",
      image: (
        <div className="mt-[88px] mb-[47px] flex justify-center">
          <img className="w-[141.65px] h-[75px]" src={"/images/plane.png"} />
        </div>
      ),
      price: (
        <div className="text-center mt-2">
          <span className="font-semibold text-[48px] leading-[57.59px] text-primary">
            Get A Quote
          </span>
        </div>
      ),
      features: [
        "Unlimited actions per month to review and moderate comments.",
        "Unlimited scheduled workflows.",
        "Quarterly retention with permanent annual summaries.",
      ],
      buttonText: "Coming Soon",
      // buttonText: "Buy Now",
      decor: (
        <img
          className="absolute w-[41.35px] h-[40px] top-[523px] right-[-17.23px]"
          src="/images/enterprise-decor.png"
        />
      ),
    },
  ],
};

const CPricingPlans: React.FC<CPricingPlansProps> = ({ pricingPlans }) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const [isYearly, setIsYearly] = React.useState<boolean>(false);

  function onChangeSwitch(bool: boolean) {
    setIsYearly(bool);
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStart - touchEnd > 150) {
      // do your stuff here for left swipe
      moveSliderRight();
    }

    if (touchStart - touchEnd < -150) {
      // do your stuff here for right swipe
      moveSliderLeft();
    }
  }

  function moveSliderRight() {
    if (pricingPlans && pricingPlans.length > 0) {
      setActiveIndex(
        activeIndex == pricingPlans.length - 1 ? pricingPlans.length - 1 : activeIndex + 1
      );
    }
  }

  function moveSliderLeft() {
    if (pricingPlans && pricingPlans.length > 0) {
      setActiveIndex(activeIndex == 0 ? 0 : activeIndex - 1);
    }
  }

  const activePricingPlan =
    pricingPlans && pricingPlans.length > 0
      ? pricingPlans.find((_, index) => {
          return index == activeIndex;
        })
      : null;

  return (
    <>
      <div className="mt-10 flex justify-center">
        <CSwitch
          label1="Monthly Pricing"
          label2="Yearly Pricing"
          value={isYearly}
          onChange={onChangeSwitch}
        />
      </div>

      <div
        className={classNames(
          "mt-[99px] px-[104px] hidden justify-center space-x-[31px]",
          "xl:flex"
        )}
      >
        {pricingPlans &&
          pricingPlans.length > 0 &&
          pricingPlans.map((pricingPlan, i) => {
            return (
              <CPlanCard
                key={i}
                planCardStyle={pricingPlan.planCardStyle}
                title={pricingPlan.title}
                features={pricingPlan.features}
                image={pricingPlan.image}
                price={pricingPlan.price}
                decor={pricingPlan.decor}
                buttonText={pricingPlan.buttonText}
                isYearly={isYearly}
                yearlyPrice={pricingPlan.yearlyPrice}
              />
            );
          })}
      </div>

      <div className={classNames("block", "xl:hidden")}>
        <div className={classNames("justify-center px-8 mt-8 flex")}>
          {activePricingPlan && (
            <CPlanCard
              planCardStyle={activePricingPlan.planCardStyle}
              title={activePricingPlan.title}
              features={activePricingPlan.features}
              image={activePricingPlan.image}
              price={activePricingPlan.price}
              decor={activePricingPlan.decor}
              buttonText={activePricingPlan.buttonText}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              isYearly={isYearly}
              yearlyPrice={activePricingPlan.yearlyPrice}
            />
          )}
        </div>
        <div className="flex justify-center">
          <div className="mt-10 space-x-[20px]">
            {pricingPlans &&
              pricingPlans.map((pricingPlan, index) => {
                const active = index == activeIndex;
                return (
                  <span
                    key={index}
                    className={classNames(
                      "rounded-little bg-[#33C286] inline-block",
                      active
                        ? "w-[30px] h-[10px]"
                        : "w-[10px] h-[10px] bg-opacity-20 cursor-pointer"
                    )}
                    onClick={() => {
                      setActiveIndex(index);
                    }}
                  ></span>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

CPricingPlans.defaultProps = defaultProps;
export default CPricingPlans;
