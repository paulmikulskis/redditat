import React from 'react'
import { AppContext } from '../context'
import IPaymentPlan from '../models/IPaymentPlan'
import TPaymentPlanKey from '../models/TPaymentPlanKey'
import { subscriptionTypes } from '../models/TSubscriptionType'
import CButton from './CButton'
import CVideoPickerPlaylistModal from './CVideoPickerPlaylistModal'

interface CFeaturesPageProps {
  paymentPlans: IPaymentPlan[]
  onClickPayment?: (key: TPaymentPlanKey) => Promise<void>
  onClickCancel?: (key: TPaymentPlanKey) => Promise<void>
}
const defaultProps: CFeaturesPageProps = {
  paymentPlans: [],
}

const CFeaturesPage: React.FC<CFeaturesPageProps> = ({
  paymentPlans,
  onClickPayment,
  onClickCancel,
}) => {
  const { user } = React.useContext(AppContext)
  const subscriptionType = user?.subscription?.type
  const subscriptionDays = user?.subscription?.days
  const subscriptionFreeTrial =
    subscriptionType == 'premium' && subscriptionDays == 3

  function _onClickPayment(key: TPaymentPlanKey) {
    onClickPayment && onClickPayment(key)
  }

  function _onClickCancel(key: TPaymentPlanKey) {
    onClickCancel && onClickCancel(key)
  }

  const hasSelected =
    subscriptionType && subscriptionTypes.includes(subscriptionType)

  return (
    <div className="mb-24 max-w-md w-full space-y-4 h-full">
      <div className="px-5 pt-5 flex flex-col justify-start">
        <div className="text-base font-bold">Purge Playlist</div>
        <div className="flex pt-5">
          <CVideoPickerPlaylistModal />
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col justify-start">
        <div className="text-base font-bold">One-time fee</div>
        <div className="flex pt-5">
          <CButton
            center
            mini
            text="Purge channel"
            className="w-auto text-xs p-2 mr-2"
            icon={null}
            onClick={() => _onClickPayment('perchannel')}
          />
          <CButton
            center
            mini
            text="Purge video"
            className="w-auto text-xs p-2"
            icon={null}
            onClick={() => _onClickPayment('pervideo')}
          />
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col justify-start">
        <div className="text-base font-bold">{'Subscription Plan'}</div>
      </div>

      {hasSelected &&
        paymentPlans
          .filter((plan) => {
            if (plan.key == 'freeTrial' && subscriptionFreeTrial) {
              return true
            } else if (subscriptionType == plan.key && !subscriptionFreeTrial) {
              return true
            }

            return false
          })
          .map((paymentplan) => {
            return (
              <div className="mx-5 mt-5 flex flex-col rounded-lg border-2 border-primary-400 p-4 bg-primary-100">
                <div className="flex items-center justify-between text-sm font-bold text-gray-600">
                  <span>{paymentplan.title}</span>
                  <span>
                    <CButton
                      center
                      mini
                      text={paymentplan.cancelText}
                      className="w-auto text-xs p-2 mr-2"
                      icon={null}
                      onClick={() => _onClickCancel(paymentplan.key)}
                    />
                  </span>
                </div>
                <div className="font-base mt-2 text-sm text-gray-600">
                  {paymentplan.features.map((feature) => {
                    return <div className="mt-1">{feature}</div>
                  })}
                </div>
              </div>
            )
          })}

      {paymentPlans
        .filter((plan) => {
          if (plan.key == 'freeTrial') {
            if (!subscriptionFreeTrial) {
              return true
            } else {
              return false
            }
          } else {
            if (subscriptionFreeTrial) {
              return true
            } else {
              return hasSelected ? plan.key != subscriptionType : true
            }
          }
        })
        .map((paymentplan: IPaymentPlan) => {
          return (
            <div className="mx-5 mt-5 flex flex-col rounded-lg border border-gray-300 p-4">
              <div className="flex items-center justify-between text-sm font-bold text-gray-600">
                <span>{paymentplan.title}</span>
                <span>
                  <CButton
                    onClick={() => {
                      if (!hasSelected) {
                        _onClickPayment(paymentplan.key)
                      }
                    }}
                    disabled={hasSelected}
                    center
                    mini
                    text={paymentplan.buttonText}
                    className="w-auto text-xs p-2 mr-2"
                    icon={null}
                  />
                </span>
              </div>
              <div className="font-base mt-2 text-sm text-gray-600">
                {paymentplan.features.map((feature) => {
                  return <div className="mt-1">{feature}</div>
                })}
              </div>
            </div>
          )
        })}
    </div>
  )
}

CFeaturesPage.defaultProps = defaultProps
export default CFeaturesPage
