import classNames from 'classnames'
import { format } from 'date-fns'
import { round } from 'lodash'
import React from 'react'
import { ISchedulePurge } from '../models/ISchedulePurge'
import { getURL } from '../utils'
import CButton from './CButton'
import CCrossIcon from './CCrossIcon'
import CDropdownButton, { IDropdownMenuOption } from './CDropdownButton'
import CIconButton from './CIconButton'
import CModal from './CModal'
import CModalIcon from './CModalIcon'
import CScheduleModal from './CScheduleModal'
import CTrashIcon from './CTrashIcon'
import CTrashIcon2 from './CTrashIcon2'

export type TVideoBoxType =
  | 'video'
  | 'schedule'
  | 'ongoing'
  | 'scheduled'
  | 'view'

interface CVideoBoxProps {
  img: string | null
  title: string | null
  purgingPercent?: number | null
  type?: TVideoBoxType
  className?: string
  style?: object
  schedulePurge?: ISchedulePurge
  hasDelete?: boolean
  date?: Date
}
const defaultProps: CVideoBoxProps = {
  img: null,
  title: null,
  purgingPercent: null,
  type: 'video',
  hasDelete: false,
}

const CVideoBox: React.FC<CVideoBoxProps> = ({
  img,
  title,
  purgingPercent,
  type,
  className,
  style,
  schedulePurge,
  hasDelete,
  date,
}) => {
  const [
    showPurgingVideoModalConfirmation,
    setShowPurgingVideoModalConfirmation,
  ] = React.useState<boolean>(false)

  const [isShowScheduleModal, setIsShowScheduleModal] =
    React.useState<boolean>(false)
  const [isShowDeleteModal, setIsShowDeleteModal] =
    React.useState<boolean>(false)

  const isVideo = type == 'video'
  const isSchedule = type == 'schedule'
  const isOngoing = type == 'ongoing'
  const isScheduled = type == 'scheduled'
  const isView = type == 'view'

  function showScheduleModal() {
    setIsShowScheduleModal(true)
  }

  function hideScheduleModal() {
    setIsShowScheduleModal(false)
  }

  function onClickSchedule() {
    showScheduleModal()
  }

  function showDeleteModal() {
    setIsShowDeleteModal(true)
  }

  function hideDeleteModal() {
    setIsShowDeleteModal(false)
  }

  function onlickRunPurgeVideo(opt: IDropdownMenuOption) {
    if (opt.key == 'purge-now') {
      setShowPurgingVideoModalConfirmation(true)
    } else if (opt.key == 'schedule') {
      onClickSchedule()
    }
  }

  return (
    <div
      className={classNames(
        'c-video-box bg-alt flex flex-col items-center rounded-databox group relative',
        hasDelete && 'hover:shadow-md',
        className
      )}
      style={style}
    >
      {hasDelete && (
        <CIconButton
          onClick={showDeleteModal}
          className="absolute right-1 top-1 group-hover:inline-block hidden"
          icon={
            <span className="w-4 h-4 flex justify-center items-center bg-alt rounded-full">
              <CTrashIcon2 size={8} className="fill-[#EC4D4D]" />
            </span>
          }
        />
      )}

      {(isScheduled || isOngoing) && (
        <div
          className="w-full h-full bg-[#ffffffcc] group-hover:inline-flex hidden flex-col items-center justify-center absolute rounded-databox"
          style={{
            backdropFilter: 'blur(5px)',
          }}
        >
          <CButton
            style={{
              width: '72px',
            }}
            text={
              <div className="flex items-center justify-center">
                <img
                  src={getURL('assets/icons/pause.svg')}
                  className="mr-[3px]"
                />
                Pause
              </div>
            }
          />
          <CIconButton
            icon={
              <div className="mt-[10px] flex items-center justify-center text-[#EC4D4D]">
                <CCrossIcon className="fill-[#EC4D4D] mr-1" />
                <span className="leading-[5px] text-xsm">Cancel</span>
              </div>
            }
          />
        </div>
      )}

      <img
        src={img ? img : ''}
        className={classNames('c-video-box-img rounded-t-databox', 'mb-2')}
      />
      <div
        className={classNames(
          'text-xsm text-txt font-bold truncate text-left px-2 w-full leading-[12px]'
        )}
      >
        {title}
      </div>

      {isVideo && (
        <CDropdownButton
          className="mt-2"
          onClick={onlickRunPurgeVideo}
          buttonStyle="alt-primary"
          text="Run Purge"
          style={{
            width: '80px',
          }}
          popupMenuStyle={{
            right: '0px',
            top: '21px',
            minWidth: '87px',
          }}
          menuOptions={[
            {
              key: 'purge-now',
              title: 'Purge Now',
            },
            {
              key: 'schedule',
              title: 'Schedule Video',
            },
          ]}
        />
      )}

      {isSchedule && (
        <CButton
          className="w-20 mt-2"
          buttonStyle="tab-primary"
          text="Schedule"
          onClick={onClickSchedule}
        />
      )}

      {isOngoing && (
        <div
          className="text-xsm text-primary font-semibold truncate text-left px-2 w-full mt-1"
          style={{ lineHeight: '12px' }}
        >
          Purging -{' '}
          {purgingPercent == null ? 100 : round(purgingPercent * 100, 0)}%
        </div>
      )}

      {isScheduled && (
        <div
          className="text-[9px] text-primary font-semibold truncate text-left px-2 w-full mt-1"
          style={{ lineHeight: '12px' }}
        >
          {schedulePurge && format(schedulePurge.date, 'MM-dd-yy, h:mmaaa')}
        </div>
      )}

      {isView && (
        <div className="text-lnk text-xsm w-full flex px-2 mt-[1px]">
          {date && format(date, 'dd MMM yyyy')}
        </div>
      )}

      {/* Margin bottom */}
      <div
        className={classNames(isView || isScheduled ? 'mb-2' : 'mb-3')}
      ></div>

      {/* Modal for purging video */}
      <CModal
        show={showPurgingVideoModalConfirmation}
        title={
          <CModalIcon icon={<img src={getURL('assets/icons/cycle.svg')} />} />
        }
        content="Do you want to run purging this video?"
        ok={() => {
          return new Promise((resolve) => {
            setShowPurgingVideoModalConfirmation(false)
            resolve()
          })
        }}
        cancel={() => {
          return new Promise((resolve) => {
            setShowPurgingVideoModalConfirmation(false)
            resolve()
          })
        }}
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
        content="Are you sure you want to remove this video?"
        ok={async () => {
          hideDeleteModal()
        }}
        cancel={async () => {
          hideDeleteModal()
        }}
      />

      <CScheduleModal
        show={isShowScheduleModal}
        cancel={async () => {
          hideScheduleModal()
        }}
      />
    </div>
  )
}

CVideoBox.defaultProps = defaultProps
export default CVideoBox
