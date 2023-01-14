import classNames from 'classnames'
import { format } from 'date-fns/esm'
import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { AppContext } from '../context'
import { getTransactionHistoryList } from '../store/slices/transactionHistorySlice'

import { getURL } from '../utils'
import CButton from './CButton'
import CIconButton from './CIconButton'
import CModal, { CModalProps } from './CModal'
import CModalIcon from './CModalIcon'

interface CTransactionHistoryPageProps {}
const defaultProps: CTransactionHistoryPageProps = {}

const CTransactionHistoryPage: React.FC<CTransactionHistoryPageProps> =
  ({}) => {
    const { setActiveNavbarKey } = React.useContext(AppContext)

    const [confirmationModalProps, setConfirmationModalProps] =
      React.useState<CModalProps>({
        title: '',
        show: false,
        content: '',
      })

    function closeConfirmationModal() {
      setConfirmationModalProps({
        title: '',
        show: false,
        content: '',
      })
    }

    function onClickExportPurgingHistory() {
      setConfirmationModalProps({
        title: (
          <CModalIcon icon={<img src={getURL('assets/icons/file.svg')} />} />
        ),
        content: 'Do you want to export transaction history?',
        show: true,
        ok: async () => {
          closeConfirmationModal()
        },
        cancel: async () => {
          closeConfirmationModal()
        },
      })
    }

    const transactionHistoryList = getTransactionHistoryList()

    return (
      <div>
        <div className="flex justify-between">
          <span className="flex items-center h-full">
            <span className="mr-2 flex items-center h-full">
              <CIconButton
                onClick={() => {
                  setActiveNavbarKey && setActiveNavbarKey('subscription')
                }}
                icon={<img src={getURL('assets/icons/arrow-back.svg')} />}
              />
            </span>
            <span className="font-bold text-title text-txt flex items-center h-full">
              Transaction History
            </span>
          </span>
          <span>
            <CButton
              onClick={onClickExportPurgingHistory}
              className="w-[72px]"
              buttonStyle="primary"
              text="Export"
              icon={<img src={getURL('assets/icons/export.svg')} />}
            />
          </span>
        </div>

        <div className="mt-3 bg-alt p-3 rounded-databox">
          <div className="border border-[#F2F4F6] text-xsm rounded-little">
            <div className="bg-bgc text-lnk h-6 grid grid-cols-3 items-center">
              <span className="text-left px-4">Type</span>
              <span className="text-left px-4">Date</span>
              <span className="text-left px-4">Amount</span>
            </div>
            <div className="bg-alt px-[10px]">
              {transactionHistoryList.map((th, index) => {
                const isLast = index == transactionHistoryList.length - 1
                return (
                  <div
                    className={classNames(
                      'grid grid-cols-3 items-center h-[30px]',
                      !isLast && 'border-b border-b-[#F2F4F6]'
                    )}
                  >
                    <span className="text-left text-primary px-[6px] font-bold">
                      {th.type}
                    </span>
                    <span className="text-left text-txt px-4 font-semibold">
                      {format(th.date, 'd MMM yy')}
                    </span>
                    <span className="text-left text-txt px-4 font-semibold">
                      ${th.amount}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <CModal {...confirmationModalProps} />
      </div>
    )
  }

CTransactionHistoryPage.defaultProps = defaultProps
export default CTransactionHistoryPage
