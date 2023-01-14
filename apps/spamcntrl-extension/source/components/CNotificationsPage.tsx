import classNames from 'classnames'
import { formatDistanceToNowStrict, subDays } from 'date-fns'
import React from 'react'
import { getNotifications } from '../store/slices/appSlice'
import CDotIcon from './CDotIcon'
import CDropdownButton from './CDropdownButton'
import CLinkButton from './CLinkButton'

interface CNotificationsPageProps {}
const defaultProps: CNotificationsPageProps = {}

const CNotificationsPage: React.FC<CNotificationsPageProps> = ({}) => {
  const notifications = getNotifications()

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-bold text-title text-txt">Notifications</span>
        <span>
          <CDropdownButton
            buttonStyle="alt"
            text="Last Week"
            menuOptions={[
              {
                key: 'last-week',
                title: 'Last Week',
              },
            ]}
          />
        </span>
      </div>
      <div className="mt-3 rounded-little bg-alt p-4">
        {notifications.map((notif, index) => {
          const isLast = index == notifications.length - 1
          const isRead = notif.isRead

          subDays(new Date(), 3), new Date(), { addSuffix: true }
          return (
            <>
              <div className="relative">
                {!isRead && (
                  <span
                    className="absolute"
                    style={{
                      left: '-6.5px',
                      top: '20.5px',
                    }}
                  >
                    <CDotIcon />
                  </span>
                )}
                <div
                  className="text-xsm text-txt font-semibold"
                  style={{
                    lineHeight: '16px',
                  }}
                >
                  {formatDistanceToNowStrict(notif.date, { addSuffix: true })}
                </div>
                <div
                  className={classNames(
                    'text-lsm',
                    isRead ? 'text-lnk font-[450]' : 'text-txt font-semibold'
                  )}
                  style={{
                    lineHeight: '16px',
                  }}
                >
                  {notif.title}
                  <span>
                    <CLinkButton linkButtonStyle={isRead ? 'black' : 'primary'}>
                      {notif.linkTitle}
                    </CLinkButton>
                  </span>
                </div>
              </div>

              {!isLast && (
                <div
                  className="h-0 border-t w-full my-2"
                  style={{ borderColor: '#F2F4F6' }}
                ></div>
              )}
            </>
          )
        })}
      </div>
    </div>
  )
}

CNotificationsPage.defaultProps = defaultProps
export default CNotificationsPage
