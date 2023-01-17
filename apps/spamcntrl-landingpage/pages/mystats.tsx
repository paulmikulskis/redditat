import classNames from 'classnames'
import { useEffect, useState } from 'react'
import CButton from '../components/CButton'
import CNavbar from '../components/CNavbar'
import CPage from '../components/CPage'
import CPanel from '../components/CPanel'
import CPieChart from '../components/CPieChart'
import CSpamalytics from '../components/CSpamalytics'
import CSpamalyticsHeader from '../components/CSpamalyticsHeader'
import { useAuth } from '../contexts/AuthContext'
import { useCustomHeaderUser } from '../hooks/useCustomHeaderUser'

import { getStats } from '../lib/firebase-utils'
import { CLMyStats } from '../models/CLMyStats'

export default function MyStats() {
  const { user, login, firebase } = useAuth()
  const [stats, setStats] = useState<CLMyStats | null | undefined>(undefined)
  const [hasHeadersEmail] = useCustomHeaderUser()

  useEffect(() => {
    if (user && user.email) {
      getStats(firebase, user.email)
        .then((_stats: CLMyStats) => {
          setStats(_stats)
        })
        .catch((_stats) => {
          setStats(_stats)
        })
    }
  }, [user])

  useEffect(() => {
    if (hasHeadersEmail != null) {
      getStats(firebase, hasHeadersEmail)
        .then((_stats: CLMyStats) => {
          setStats(_stats)
        })
        .catch((_stats) => {
          setStats(_stats)
        })
    }
  }, [hasHeadersEmail])

  return (
    <CPage>
      <CPanel className="min-h-[500px]">
        <CNavbar navbarStyle="alt" />

        <div className="flex justify-center mt-[80px] flex-col items-center">
          {user == null && hasHeadersEmail == null ? (
            <div className={classNames('px-8', 'xl:max-w-[900px]')}>
              <div
                className={classNames(
                  'text-[32px] max-w-[350px] font-bold text-center',
                  'xl:text-left'
                )}
              >
                Spamalytics
              </div>

              <div className="mt-[32px]">
                <div
                  className={classNames(
                    'text-lnk text-base mb-2 w-full text-center',
                    'xl:text-left'
                  )}
                >
                  Log in to see your youtube channel&apos;s spamalytics (Spam
                  Analytics)
                </div>
              </div>

              <div
                className={classNames('mt-4 flex justify-center', 'xl:block')}
              >
                <CButton
                  onClick={login}
                  text="Login w/ Google"
                  buttonStyle="primary"
                  style={{ width: '170px' }}
                />
              </div>
            </div>
          ) : null}

          <div>
            <CSpamalytics
              stats={stats}
              user={user}
              hasHeadersEmail={hasHeadersEmail}
            />
          </div>
        </div>
      </CPanel>
    </CPage>
  )
}
