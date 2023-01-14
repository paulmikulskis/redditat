import classNames from 'classnames'
import { format, formatDistanceToNowStrict } from 'date-fns'
import React from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useDispatch } from 'react-redux'
import { AppContext } from '../context'
import {
  getPurgingHistoryList,
  getPurgingHistorySearchText,
  setPurgingHistorySearchText,
} from '../store/slices/purgeHistorySlice'

import { getURL } from '../utils'
import CButton from './CButton'
import CCheckbox from './CCheckbox'
import CDropdownButton from './CDropdownButton'
import CIconButton from './CIconButton'
import CTrashIcon from './CTrashIcon'
import CInput from './CInput'
import { CLPurgingHistory, CLPurgingHistoryComment } from './CLPurgingHistory'
import CModal, { CModalProps } from './CModal'
import CModalIcon from './CModalIcon'
import CSearchIcon from './CSearchIcon'

interface CPurgingHistoryCommentBoxProps {
  spamComment: CLPurgingHistoryComment
}
const CPurgingHistoryCommentBox: React.FC<CPurgingHistoryCommentBoxProps> = ({
  spamComment,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] =
    React.useState<boolean>(false)

  function showDeleteModal() {
    setIsShowDeleteModal(true)
  }

  function hideDeleteModal() {
    setIsShowDeleteModal(false)
  }

  return (
    <div className="relative group">
      <div>
        <span className="text-txt text-xsm leading-[14px] mr-1 font-bold">
          {spamComment.author}
        </span>
        <span className="text-lnk text-[8px] leading-[14px] font-[450]">
          {formatDistanceToNowStrict(spamComment.date, { addSuffix: true })}
        </span>
      </div>
      <div className="text-xxsm text-lnk leading-[11.38px]">
        {spamComment.comment}
      </div>
      <CIconButton
        onClick={showDeleteModal}
        className="absolute hidden group-hover:inline-block m-auto top-0 bottom-0 right-1"
        icon={<CTrashIcon className="fill-[#EC4D4D]" />}
      />

      {/* Delete Modal */}
      <CModal
        show={isShowDeleteModal}
        title={
          <CModalIcon
            type="error"
            icon={<CTrashIcon size={12} className="fill-[#EC4D4D]" />}
          />
        }
        content="Are you sure you want to purge this comment?"
        ok={async () => {
          hideDeleteModal()
        }}
        cancel={async () => {
          hideDeleteModal()
        }}
      />
    </div>
  )
}

interface CPurgingHistoryCardProps {
  purgingHistory: CLPurgingHistory
}

const CPurgingHistoryCard: React.FC<CPurgingHistoryCardProps> = ({
  purgingHistory,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(false)
  const [selectAll, setSelectAll] = React.useState<boolean>(false)

  return (
    <div
      className={classNames(
        'bg-alt rounded-databox h-auto w-full',
        expanded ? 'py-[10px]' : 'py-2'
      )}
    >
      <div
        className={classNames(
          'flex items-center relative',
          expanded ? 'px-[10px]' : 'px-2'
        )}
      >
        {/* thumbnail */}
        <span className="mr-2">
          <img
            className="w-[42px] h-[28px] rounded-[3px]"
            src={purgingHistory.thumbnail}
          />
        </span>

        {/* video information */}
        <span className="flex flex-col text-xsm leading-[14px]">
          <div className="text-txt truncate w-[125px] font-bold">
            {purgingHistory.title}
          </div>
          <div className="text-lnk font-[450]">
            {format(purgingHistory.date, 'dd MMM yyyy')}
          </div>
        </span>

        <span className="mx-4 border-l border-[#F2F4F6] w-0 h-4"></span>

        {/* spam count */}
        <span className="flex flex-col text-xsm  leading-[14px]">
          <div className="font-[450] text-txt">Spam</div>
          <div className="font-bold text-primary">
            {purgingHistory.spamComments.length}
          </div>
        </span>

        {/* actions */}
        <span
          className="absolute right-[10px] cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <img
            src={
              expanded
                ? 'assets/icons/arrow-up.svg'
                : 'assets/icons/arrow-down.svg'
            }
          />
        </span>
      </div>

      {/* Expanded details */}
      {/* separator */}
      {expanded && (
        <>
          <div
            className={classNames(
              'px-[10px] border-t border-[#F2F4F6] mt-[9px]'
            )}
          ></div>

          <div className="px-[10px] mt-2 mb-[1px]">
            {/* comments */}
            <div className="flex justify-between">
              <span className="flex">
                <CCheckbox
                  label="Select All"
                  onChange={(el) => setSelectAll(el.target.checked)}
                  value={selectAll}
                />
                {selectAll && (
                  <span className="text-[9px] text-primary bg-[#EFE9FF] rounded-full w-4 h-4 flex items-center justify-center">
                    {purgingHistory.spamComments.length}
                  </span>
                )}
              </span>
              <span className="flex items-center">
                {selectAll ? (
                  <CIconButton
                    icon={
                      <span className="flex items-center">
                        <CTrashIcon className="fill-[#EC4D4D] mr-1" />
                        <span className="text-lsm text-txt leading-[12.65px] font-bold">
                          Delete
                        </span>
                      </span>
                    }
                  />
                ) : (
                  <CIconButton
                    icon={
                      <span className="flex items-center">
                        <CTrashIcon className="fill-lnk mr-1" />
                        <span className="text-lsm text-lnk leading-[12.65px] font-medium">
                          Delete
                        </span>
                      </span>
                    }
                  />
                )}
              </span>
            </div>
          </div>

          <div className="c-databox pl-[10px] pr-[5px] mr-[5px] max-h-[140px] overflow-y-auto">
            {purgingHistory.spamComments.map((spamComment, index) => {
              const isLast: boolean =
                purgingHistory.spamComments.length - 1 == index

              return (
                <>
                  <span className={classNames(isLast ? 'mb-[3px]' : '')}>
                    <CPurgingHistoryCommentBox spamComment={spamComment} />
                  </span>

                  {!isLast && (
                    <div className="border-t border-[#F2F4F6] w-full mt-[7px] mb-2"></div>
                  )}
                </>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

interface CPurgingHistoryPageProps {}
const defaultProps: CPurgingHistoryPageProps = {}

const CPurgingHistoryPage: React.FC<CPurgingHistoryPageProps> = ({}) => {
  const dispatch = useDispatch()

  const { setActiveNavbarKey } = React.useContext(AppContext)

  const purgingHistorySearchText = getPurgingHistorySearchText()
  const purgingHistoryList = getPurgingHistoryList()

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
      content: 'Do you want to export purging history?',
      show: true,
      ok: async () => {
        closeConfirmationModal()
      },
      cancel: async () => {
        closeConfirmationModal()
      },
    })
  }

  return (
    <div>
      <div className="flex justify-between">
        <span className="flex items-center h-full">
          <span className="mr-2 flex items-center h-full">
            <CIconButton
              onClick={() => {
                setActiveNavbarKey && setActiveNavbarKey('purging')
              }}
              icon={<img src={getURL('assets/icons/arrow-back.svg')} />}
            />
          </span>
          <span className="font-bold text-title text-txt flex items-center h-full">
            Purging History
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

      <div className="mt-3 flex">
        <CInput
          onChange={(e) =>
            dispatch(setPurgingHistorySearchText(e.target.value))
          }
          icon={<CSearchIcon />}
          value={purgingHistorySearchText}
          placeholder={'Search videos...'}
        />
        <span className="ml-3">
          <CDropdownButton
            menuOptionsStyle={{
              marginTop: '8px',
              marginBottom: '8px',
            }}
            popupMenuStyle={{
              paddingLeft: '8px',
              paddingRight: '8px',
              top: '31px',
              width: '104px',
            }}
            buttonStyle="alt"
            style={{
              width: '96px',
              height: '32px',
            }}
            text={
              <span className="flex">
                <span className="mr-1">
                  <img
                    className="w-3 h-3"
                    src={getURL('assets/icons/filter.svg')}
                  />
                </span>
                <span>Filter</span>
              </span>
            }
            menuOptions={[
              {
                key: 'date',
                title: 'Date',
              },
              {
                key: 'most-spam',
                title: 'Most Spam',
              },
              {
                key: 'least-spam',
                title: 'Least Spam',
              },
            ]}
          />
        </span>
      </div>

      {/* History list */}
      <div className="my-3 flex flex-col space-y-2">
        {purgingHistoryList.map((purgeHistory) => {
          return <CPurgingHistoryCard purgingHistory={purgeHistory} />
        })}
      </div>

      <CModal {...confirmationModalProps} />
    </div>
  )
}

CPurgingHistoryPage.defaultProps = defaultProps
export default CPurgingHistoryPage
