import React, { useContext, useEffect, useState } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { AppContext } from '../context'
import { IPaymentMethod } from '../models'
import { getLastNDigits, getPaymentMethod, prependZero } from '../utils'
import CButton from './CButton'
import CLoader from './CLoader'
import CPaymentCardModal from './CPaymentCardModal'

interface CCardPageProps {}
const defaultProps: CCardPageProps = {}

const CCardPage: React.FC<CCardPageProps> = ({}) => {
  const { user } = useContext(AppContext)
  const [paymentMethod, setPaymentMethod] =
    useState<IPaymentMethod | null | undefined>(undefined)
  const [showPaymentCardModel, setShowPaymentCardModel] =
    useState<Boolean>(false)

  useEffect(() => {
    if (user && user.uuid) {
      getPaymentMethod(user.uuid)
        .then((paymentMethods) => {
          if (paymentMethods && paymentMethods.length > 0) {
            setPaymentMethod(paymentMethods[0])
          } else {
            setPaymentMethod(null)
          }
        })
        .catch(() => {
          setPaymentMethod(null)
        })
    }
  }, [])

  function isValid(paymentMethod: IPaymentMethod | null | undefined) {
    if (paymentMethod == null || paymentMethod == undefined) {
      return false
    }

    return (
      paymentMethod &&
      paymentMethod.billing_details &&
      paymentMethod.billing_details.name &&
      paymentMethod.card.last4 &&
      paymentMethod.card.exp_month &&
      paymentMethod.card.exp_year
    )
  }

  const loading = paymentMethod === undefined
  const hasPaymentMethod = !loading && isValid(paymentMethod)

  return (
    <div className="mb-8 max-w-md w-full space-y-4">
      <div className={`px-5 pt-5 justify-between flex`}>
        <h2 className="text-base font-bold flex items-center">
          {hasPaymentMethod || paymentMethod === undefined
            ? 'Payment card details'
            : 'Add payment card'}
        </h2>

        {paymentMethod === undefined ? (
          <></>
        ) : hasPaymentMethod ? (
          <span className="flex">
            <CButton
              center
              mini
              text="Remove Card"
              className="text-xs p-2 mr-2"
              icon={null}
            />
          </span>
        ) : (
          <CButton
            center
            mini
            text="Add Card"
            className="w-24 text-xs p-2"
            icon={null}
            onClick={() => setShowPaymentCardModel(true)}
          />
        )}
      </div>

      {loading ? (
        <CLoader show inline />
      ) : (
        <>
          {!hasPaymentMethod && (
            <div className="px-5">
              <h2 className="text-2xl font-bold text-primary-400">
                No Card Found!
              </h2>
              <p className="mt-1 font-semibold text-sm text-primary-300">
                Please click "Add Card" to set up one.
              </p>
            </div>
          )}

          {hasPaymentMethod && paymentMethod && (
            <div className="px-4">
              <div className="rounded-md p-4 w-full border border-gray-300">
                <div className="text-left text-sm font-bold text-gray-600 pb-2 border-b border-gray-200">
                  XXXX XXXX XXXX {paymentMethod.card.last4}
                </div>
                <div className="mt-3 text-xs text-gray-600 font-semibold">
                  <div>
                    {prependZero(paymentMethod.card.exp_month)}/
                    {getLastNDigits(paymentMethod.card.exp_year)}
                  </div>
                  <div>{paymentMethod.billing_details.name}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <CPaymentCardModal
        show={showPaymentCardModel}
        onClose={() => {
          setShowPaymentCardModel(false)
        }}
      />
    </div>
  )
}

CCardPage.defaultProps = defaultProps
export default CCardPage
