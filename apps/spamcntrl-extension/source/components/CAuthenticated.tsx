import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppContext } from '../context'
import ICreatePayment from '../models/ICreatePayment'
import { hideLoader, setLoader } from '../store/slices/appSlice'
import { createPayment } from '../utils'
import CModal, { CModalProps } from './CModal'
import CPaymentCardModal from './CPaymentCardModal'
import CPurgeChannelModal from './CPurgeChannelModal'
import CPurgeVideoModal from './CPurgeVideoModal'
import CPurgingPage from './CPurgingPage'
import CDashboardPage from './CDashboardPage'
import CHelpPage from './CHelpPage'
import CNotificationsPage from './CNotificationsPage'
import CPurgingHistoryPage from './CPurgingHistoryPage'
import CMyVideosPage from './CMyVideosPage'
import CSchedulePurgePage from './CSchedulePurgePage'
import COngoingPurgePage from './COngoingPurgePage'
import CMyPlaylistPage from './CMyPlaylistPage'
import CCreatePlaylistPage from './CCreatePlaylistPage'
import CSubscriptionPage from './CSubscriptionPage'
import CPricingPlanPage from './CPricingPlanPage'
import CSinglePurgePage from './CSinglePurgePage'
import CTransactionHistoryPage from './CTransactionHistoryPage'

interface CAuthenticatedProps {}
const defaultProps: CAuthenticatedProps = {}

const CAuthenticated: React.FC<CAuthenticatedProps> = ({}) => {
  const dispatch = useDispatch()

  const [showPaymentCardModel, setShowPaymentCardModel] =
    useState<Boolean>(false)
  const [showPurgeVideoModal, setShowPurgeVideoModal] = useState<Boolean>(false)
  const [showPurgeChannelModal, setShowPurgeChannelModal] =
    useState<Boolean>(false)
  const [confirmModalData] = useState<CModalProps>({
    title: 'Confirm Payment',
    content: 'Are you sure you want to confirm this payment?',
  })

  const { user, notify, activeNavbarItem, setActiveNavbarKey } =
    React.useContext(AppContext)
  const subscriptionType = user?.subscription?.type
  const hasDiscount = subscriptionType == 'premium'

  const [payment] = useState<ICreatePayment>({
    amount: 0,
    currency: 'usd',
    payment_method: null,
    status: 'new',
  })

  async function onCloseVideoPurgeModal() {
    setShowPurgeVideoModal(false)
  }

  async function onCloseChannelPurgeModal() {
    setShowPurgeChannelModal(false)
  }

  async function onPurgeVideoModal() {
    if (user && user.uuid) {
      dispatch(
        setLoader({
          title: 'Starting the purge of your youtube video...',
          show: true,
        })
      )
      createPayment(user.uuid || '', payment).then((res) => {
        if (res.status == 'success') {
          notify({
            message: 'Your video purging has started.',
            type: 'success',
          })
          setActiveNavbarKey && setActiveNavbarKey('purging')
        } else {
          notify({
            message: 'Error purging your youtube video.',
            type: 'error',
          })
        }
        dispatch(hideLoader())
      })
    }
  }

  async function onPurgeChannelModal() {
    if (user && user.uuid) {
      dispatch(
        setLoader({
          title: 'Starting the purge of your youtube channel...',
          show: true,
        })
      )
      createPayment(user.uuid || '', payment).then((res) => {
        if (res.status == 'success') {
          notify({
            message: 'Your channel purging has started.',
            type: 'success',
          })
          setActiveNavbarKey && setActiveNavbarKey('purging')
        } else {
          notify({
            message: 'Error purging your channel.',
            type: 'error',
          })
        }
        dispatch(hideLoader())
      })
    }
  }

  // async function onClickCancelSubscription(_: TPaymentPlanKey) {
  //   if (user && user.uuid) {
  //     setConfirmModalData({
  //       title: 'Cancel Subscription',
  //       content: `Are you sure you want to cancel your subscription?`,
  //       okText: 'Yes',
  //       cancelText: 'No',
  //       show: true,
  //       ok: async () => {
  //         if (user && user.uuid) {
  //           dispatch(
  //             setLoader({
  //               title: 'Cancelling subscription...',
  //               show: true,
  //             })
  //           )
  //           updateSubscription(user.uuid, 365, 'basic').then((res) => {
  //             if (res && res.status == 200) {
  //               setSubscription && setSubscription(res.data as ISubscription)
  //               notify({
  //                 message: res.message,
  //                 type: 'success',
  //               })
  //             } else {
  //               notify({
  //                 message: res.error,
  //                 type: 'error',
  //               })
  //             }

  //             dispatch(hideLoader())
  //           })
  //         }

  //         setConfirmModalData({
  //           title: '',
  //           content: '',
  //           show: false,
  //         })
  //       },
  //       cancel: async () => {
  //         setConfirmModalData({
  //           title: '',
  //           content: '',
  //           show: false,
  //         })
  //       },
  //     })
  //   }
  // }

  // async function onClickPayment(key: TPaymentPlanKey) {
  //   if (user && user.uuid) {
  //     const paymentMethod = await getPaymentMethod(user.uuid).then(
  //       (payments) => {
  //         if (payments && payments.length > 0) {
  //           return payments[0]
  //         } else {
  //           return null
  //         }
  //       }
  //     )

  //     if (!paymentMethod) {
  //       setShowPaymentCardModel(true)
  //     } else {
  //       let amount: number = 0
  //       const plan = PAYMENT_PLANS.find((plan) => {
  //         return plan.key == key
  //       })
  //       if (hasDiscount) {
  //         amount = plan?.discountAmount || 0
  //       } else {
  //         amount = plan?.amount || 0
  //       }

  //       setPayment({
  //         amount: formatAmountForStripe(amount, 'usd'),
  //         currency: 'usd',
  //         payment_method: paymentMethod.id,
  //         status: 'new',
  //       })

  //       switch (key) {
  //         case 'premium':
  //           setConfirmModalData({
  //             title: 'Subscribe Premium Plan',
  //             content: 'Are you sure you want to subscribe to premium plan?',
  //             okText: 'Yes',
  //             cancelText: 'No',
  //             show: true,
  //             ok: async () => {
  //               if (user && user.uuid) {
  //                 dispatch(
  //                   setLoader({
  //                     title: 'Subscribing to premium plan...',
  //                     show: true,
  //                   })
  //                 )
  //                 updateSubscription(user.uuid, 365, 'premium').then((res) => {
  //                   if (res && res.status == 200) {
  //                     setSubscription &&
  //                       setSubscription(res.data as ISubscription)
  //                     notify({
  //                       message: res.message,
  //                       type: 'success',
  //                     })
  //                   } else {
  //                     notify({
  //                       message: res.error,
  //                       type: 'error',
  //                     })
  //                   }

  //                   dispatch(hideLoader())
  //                 })
  //               }

  //               setConfirmModalData({
  //                 title: '',
  //                 content: '',
  //                 show: false,
  //               })
  //             },
  //             cancel: async () => {
  //               setConfirmModalData({
  //                 title: '',
  //                 content: '',
  //                 show: false,
  //               })
  //             },
  //           })
  //           break
  //         case 'freeTrial':
  //           setConfirmModalData({
  //             title: 'Try the Premium Plan',
  //             content:
  //               'Are you sure you want to try the premium plan for 3 days?',
  //             okText: 'Yes',
  //             cancelText: 'No',
  //             show: true,
  //             ok: async () => {
  //               if (user && user.uuid) {
  //                 dispatch(
  //                   setLoader({
  //                     title: 'Subscribing to free trial...',
  //                     show: true,
  //                   })
  //                 )
  //                 updateSubscription(user.uuid, 3, 'premium').then((res) => {
  //                   if (res && res.status == 200) {
  //                     setSubscription &&
  //                       setSubscription(res.data as ISubscription)
  //                     notify({
  //                       message: res.message,
  //                       type: 'success',
  //                     })
  //                   } else {
  //                     notify({
  //                       message: res.error,
  //                       type: 'error',
  //                     })
  //                   }

  //                   dispatch(hideLoader())
  //                 })
  //               }

  //               setConfirmModalData({
  //                 title: '',
  //                 content: '',
  //                 show: false,
  //               })
  //             },
  //             cancel: async () => {
  //               setConfirmModalData({
  //                 title: '',
  //                 content: '',
  //                 show: false,
  //               })
  //             },
  //           })
  //           break
  //         case 'perchannel':
  //           setShowPurgeChannelModal(true)
  //           break
  //         case 'pervideo':
  //           setShowPurgeVideoModal(true)
  //           break
  //       }
  //     }
  //   }
  // }

  function getPages() {
    if (activeNavbarItem) {
      switch (activeNavbarItem.key) {
        case 'dashboard':
          return <CDashboardPage />
        case 'purging':
          return <CPurgingPage />
        case 'help':
          return <CHelpPage />
        case 'notifications':
          return <CNotificationsPage />
        case 'purging-history':
          return <CPurgingHistoryPage />
        case 'my-videos':
          return <CMyVideosPage />
        case 'schedule-purge':
          return <CSchedulePurgePage />
        case 'ongoing-purge':
          return <COngoingPurgePage />
        case 'my-playlist':
          return <CMyPlaylistPage />
        case 'create-playlist':
          return <CCreatePlaylistPage />
        case 'subscription':
          return <CSubscriptionPage />
        case 'pricing-plan':
          return <CPricingPlanPage />
        case 'single-purge':
          return <CSinglePurgePage />
        case 'transaction-history':
          return <CTransactionHistoryPage />
        default:
          return null
      }
    }

    return null
  }

  if (false) {
    return <div></div>
  } else {
    return (
      <div className="pl-4 pr-[7px] mr-[7px] py-3 c-authenticated">
        {getPages()}
        <CPaymentCardModal
          show={showPaymentCardModel}
          onClose={() => {
            setShowPaymentCardModel(false)
          }}
        />
        <CModal {...confirmModalData} />

        <CPurgeVideoModal
          show={showPurgeVideoModal}
          onClose={onCloseVideoPurgeModal}
          onPurge={onPurgeVideoModal}
          hasDiscount={hasDiscount}
        />

        <CPurgeChannelModal
          show={showPurgeChannelModal}
          onPurge={onPurgeChannelModal}
          onClose={onCloseChannelPurgeModal}
          hasDiscount={hasDiscount}
        />
      </div>
    )
  }
}

CAuthenticated.defaultProps = defaultProps
export default CAuthenticated
