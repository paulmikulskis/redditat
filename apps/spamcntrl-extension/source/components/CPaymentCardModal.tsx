import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppContext } from '../context'
import { hideLoader, setLoader } from '../store/slices/appSlice'
import {
  getStripe,
  getStripeCustomer,
  stripeCustomersAddPaymentMethod,
} from '../utils'
import CModal from './CModal'

interface CPaymentCardModalProps {
  show?: Boolean
  onClose?: () => void | null | undefined
}
const defaultProps: CPaymentCardModalProps = {
  show: false,
  onClose: undefined,
}

const CPaymentCardModal: React.FC<CPaymentCardModalProps> = ({
  show,
  onClose,
}) => {
  const dispatch = useDispatch()

  const [stripe, setStripe] = useState<stripe.Stripe | null>()
  const [cardHolderName, setCardHolderName] = useState<string>()
  const [cardElement, setCardElement] = useState<stripe.elements.Element>()

  const { user, notify } = useContext(AppContext)

  useEffect(() => {
    if (show) {
      getStripe().then((stripe) => {
        setStripe(stripe)
      })
    }
  }, [show])

  useEffect(() => {
    if (stripe) {
      const elements = stripe.elements()
      const cardElement = elements.create('card')
      cardElement.mount('#card-element')
      cardElement.on('change', (res: any) => {
        if (res && res.error) {
          notify({
            message: res.error.message,
            type: 'error',
          })
        }
      })
      setCardElement(cardElement)
    }
  }, [stripe])

  async function saveCard() {
    if (stripe && cardElement) {
      const stripeCustomer = await getStripeCustomer(user?.id || '')
      const { setupIntent, error } = await stripe.confirmCardSetup(
        stripeCustomer.setup_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardHolderName,
            },
          },
        }
      )

      if (error) {
        notify({
          message: error.message || 'Problem with setting card.',
          type: 'error',
        })
      } else {
        if (setupIntent && setupIntent.payment_method && user && user.uuid) {
          dispatch(
            setLoader({
              title: 'Adding payment method...',
              show: true,
            })
          )

          stripeCustomersAddPaymentMethod(
            user.uuid,
            setupIntent.payment_method
          ).then(() => {
            dispatch(hideLoader())
            notify({
              message: 'Successfully added payment card',
              type: 'success',
            })
          })
          onClose && onClose()
        } else {
          notify({
            message:
              'Problem with setting card. No Payment method ID recevied.',
            type: 'error',
          })
        }
      }
    }
  }

  async function cancelCard() {
    onClose && onClose()
  }

  return (
    <CModal
      show={show}
      // icon={
      //   <svg
      //     xmlns="http://www.w3.org/2000/svg"
      //     className="h-6 w-6 text-blue-600"
      //     fill="none"
      //     viewBox="0 0 24 24"
      //     stroke="currentColor"
      //     strokeWidth={2}
      //   >
      //     <path
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //       d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      //     />
      //   </svg>
      // }
      title="Payment Card"
      content={
        <div className="w-full" id="payment-method-form">
          {/* Cardholder name */}
          <div className="w-full">
            <div className="relative mt-4">
              <input
                id="payment-details_name"
                name="email"
                type="text"
                className="text-sm peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600"
                placeholder="Name"
                onChange={(e) => setCardHolderName(e.target.value)}
                value={cardHolderName}
              />
              <label
                htmlFor="payment-details_name"
                className="absolute left-0 -top-3.5 text-gray-600 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-xs"
              >
                Name
              </label>
            </div>
          </div>
          <div id="card-element" className="my-4"></div>
        </div>
      }
      ok={saveCard}
      okText="Save Card"
      cancel={cancelCard}
      cancelText="Cancel"
    />
  )
}

CPaymentCardModal.defaultProps = defaultProps
export default CPaymentCardModal
