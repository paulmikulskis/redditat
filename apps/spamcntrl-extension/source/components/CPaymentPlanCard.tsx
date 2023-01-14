import React from 'react'
import { AppContext } from '../context'
import CCheckoutButton from './CCheckoutButton'

export interface CPaymentPlanCardProps {
  title: string
  note?: string
  amount?: string
  subAmount?: string
  description: string
  buttonText?: string
  style?: object
  confirmHeader?: string
  confirmText?: string
}
const defaultProps: CPaymentPlanCardProps = {
  amount: '',
  title: '',
  description: '',
  confirmHeader: '',
  confirmText: '',
}

const CPaymentPlanCard: React.FC<CPaymentPlanCardProps> = ({
  amount,
  title,
  note,
  subAmount,
  description,
  buttonText,
  confirmHeader,
  confirmText,
  style,
}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext)

  function goToSinglePurgePage() {
    setActiveNavbarKey && setActiveNavbarKey('single-purge')
  }

  return (
    <div
      className="group rounded-databox bg-alt w-[152px] h-[195px] f pt-3 px-3 pb-4 flex flex-col justify-between cursor-pointer border border-transparent hover:border-primary"
      style={style}
    >
      <div>
        <div className="flex justify-between w-full">
          <span className="text-txt text-xsm font-bold">{title}</span>
          <div className="flex flex-col items-end mt-[-2px]">
            <span className="flex text-primary items-end">
              <span className="text-lsm font-semibold">{amount}</span>
              <span className="text-[9px] font-semibold">{subAmount}</span>
            </span>
            {note ? (
              <div className="text-[8px] text-lnk font-[450]">{note}</div>
            ) : (
              <div className="mt-[6px]"></div>
            )}
          </div>
        </div>
        <div className="mt-[4px] text-lnk text-[9px] font-[450]">
          {description}
        </div>
      </div>
      <div className="mt-4 mb-1 flex justify-center items-center w-full">
        <CCheckoutButton
          text={buttonText}
          confirmText={confirmText}
          confirmHeader={confirmHeader}
          onClick={title == 'Single Purge' ? goToSinglePurgePage : undefined}
        />
      </div>
    </div>
  )
}

CPaymentPlanCard.defaultProps = defaultProps
export default CPaymentPlanCard
