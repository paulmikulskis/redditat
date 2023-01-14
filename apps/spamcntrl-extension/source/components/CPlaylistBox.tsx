import classNames from 'classnames'
import { format } from 'date-fns'
import React from 'react'
import { useDispatch } from 'react-redux'
import { AppContext } from '../context'
import { ISchedulePurge } from '../models/ISchedulePurge'
import {
  setCreatePlaylistEdit,
  setCreatePlaylistTitle,
} from '../store/slices/createPlaylistSlice'
import { getURL } from '../utils'
import CButton from './CButton'
import CCrossIcon from './CCrossIcon'
import CDropdownButton from './CDropdownButton'
import CIconButton from './CIconButton'
import CModal from './CModal'
import CModalIcon from './CModalIcon'
import CTrashIcon from './CTrashIcon'
import CTrashIcon2 from './CTrashIcon2'

export type TPlaylistBoxType = 'normal' | 'schedule' | 'scheduled'

interface CPlaylistBoxProps {
  img: string | null
  title: string | null
  count: number | null
  type?: TPlaylistBoxType
  schedulePurge?: ISchedulePurge
  hasDelete?: boolean
}
const defaultProps: CPlaylistBoxProps = {
  img: null,
  title: null,
  count: null,
  type: 'normal',
  hasDelete: false,
}

const CPlaylistBox: React.FC<CPlaylistBoxProps> = ({
  img,
  title,
  count,
  type,
  schedulePurge,
  hasDelete,
}) => {
  const { setActiveNavbarKey } = React.useContext(AppContext)
  const dispatch = useDispatch()

  const [isShowDeleteModal, setIsShowDeleteModal] =
    React.useState<boolean>(false)

  function showDeleteModal() {
    setIsShowDeleteModal(true)
  }

  function hideDeleteModal() {
    setIsShowDeleteModal(false)
  }

  const isNormal = type == 'normal'
  const isSchedule = type == 'schedule'
  const isScheduled = type == 'scheduled'

  return (
    <div
      className={classNames(
        'c-playlist-box bg-alt flex flex-col items-center rounded-databox group relative',
        hasDelete && 'hover:shadow-md'
      )}
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

      {isScheduled && (
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
        className="c-video-box-img rounded-t-databox mb-2"
      />
      <div
        className="cursor-pointer flex flex-col w-full"
        onClick={() => {
          if (title) {
            dispatch(setCreatePlaylistTitle(title))
            dispatch(setCreatePlaylistEdit(true))
            setActiveNavbarKey && setActiveNavbarKey('create-playlist')
          }
        }}
      >
        <div
          className="text-xsm text-txt font-bold truncate text-left px-2 w-full mb-1"
          style={{ lineHeight: '12px' }}
        >
          {title}
        </div>
        <div
          className="text-xsm text-lnk font-medium truncate text-left px-2 w-full"
          style={{ lineHeight: '12px' }}
        >
          {count} Videos
        </div>
      </div>

      {/* Normal */}
      {isNormal && (
        <span className="mt-2">
          <CDropdownButton
            buttonStyle="alt-primary"
            text="Run Purge"
            style={{
              width: '80px',
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
        </span>
      )}

      {/* Schedule */}
      {isSchedule && (
        <CButton
          className="w-20 mt-2"
          buttonStyle="tab-primary"
          text="Schedule"
        />
      )}

      {/* Scheduled */}
      {isScheduled && (
        <div
          className="text-[9px] text-primary font-semibold truncate text-left px-2 w-full mt-1"
          style={{ lineHeight: '12px' }}
        >
          {schedulePurge && format(schedulePurge.date, 'MM-dd-yy, h:mmaaa')}
        </div>
      )}

      {/* Margin Bottom */}
      <div className={isScheduled ? 'mb-2' : 'mb-[10px]'}></div>

      {/* Delete Modal */}
      <CModal
        show={isShowDeleteModal}
        title={
          <CModalIcon
            type="error"
            icon={<CTrashIcon size={12} className="fill-[#EC4D4D]" />}
          />
        }
        content="Are you sure you want to remove this playlist?"
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

CPlaylistBox.defaultProps = defaultProps
export default CPlaylistBox
