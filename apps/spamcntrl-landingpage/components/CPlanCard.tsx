import classNames from 'classnames'
import React from 'react'
import CButton from './CButton'

type TPlanCardStyle = 'primary' | 'alt'

export interface CPlanCardProps {
  planCardStyle?: TPlanCardStyle
  image?: React.ReactNode
  title?: React.ReactNode
  price?: React.ReactNode
  yearlyPrice?: React.ReactNode
  features?: string[]
  buttonText?: string
  decor?: React.ReactNode
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void
  onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void
  isYearly?: boolean
}
const defaultProps: CPlanCardProps = {
  planCardStyle: 'primary',
}

const CPlanCard: React.FC<CPlanCardProps> = ({
  planCardStyle,
  image,
  title,
  price,
  features,
  buttonText,
  decor,
  onTouchMove,
  onTouchStart,
  onTouchEnd,
  isYearly,
  yearlyPrice,
}) => {
  return (
    <div
      className="inline-block w-[390px] min-h-[686px] relative"
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {decor}
      <img
        className="w-full h-full absolute -z-10"
        src={
          planCardStyle == 'primary'
            ? '/images/plancard-primary-bg.png'
            : '/images/plancard-alt-bg.png'
        }
      />

      {/* Content */}
      {image}

      {title && (
        <div
          className={classNames(
            'flex justify-center font-medium text-[24px] leading-[28.79px]',
            planCardStyle == 'primary' && 'text-alt',
            planCardStyle == 'alt' && 'text-txt'
          )}
        >
          {title}
        </div>
      )}

      {isYearly && yearlyPrice != null ? yearlyPrice : price}

      {features && (
        <div className="mt-[56px]">
          {features.map((feature, index) => {
            const isLast = index == features.length - 1

            return (
              <div
                key={feature}
                className={classNames(
                  'pl-6 pr-[33px] flex items-center',
                  !isLast && 'mb-6'
                )}
              >
                <img
                  className="mr-4"
                  src={
                    planCardStyle == 'primary'
                      ? '/images/check-primary.png'
                      : '/images/check-alt.png'
                  }
                />
                <span
                  className={classNames(
                    'font-normal text-base leading-[24px]',
                    planCardStyle == 'primary' && 'text-alt',
                    planCardStyle == 'alt' && 'text-lnk'
                  )}
                >
                  {feature}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className="min-h-[134px]"></div>

      {buttonText && (
        <CButton
          className="absolute bottom-[35px] mx-auto left-0 right-0"
          text={buttonText}
          style={{
            fontSize: '18px',
            fontWeight: 500,
            fontFamily: 'Gelion',
            borderRadius: '15px',
            background:
              planCardStyle == 'alt' ? 'rgba(96, 34, 255, 0.13)' : '#FFF',
            width: 'calc(100% - 70px)',
            marginLeft: '35px',
            marginRight: '35px',
            height: '64px',
            color: planCardStyle == 'alt' ? 'rgba(96, 34, 255, 1)' : '#6432E4',
          }}
        />
      )}
    </div>
  )
}

CPlanCard.defaultProps = defaultProps
export default CPlanCard
