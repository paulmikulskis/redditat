import classNames from 'classnames'
import CButton from '../components/CButton'
import CFooter from '../components/CFooter'
import CInput from '../components/CInput'
import CInputTextArea from '../components/CInputTextArea'
import CNavbar from '../components/CNavbar'
import CPage from '../components/CPage'
import CPanel from '../components/CPanel'

export default function Home() {
  return (
    <CPage>
      <CPanel className="min-h-[850px]">
        <CNavbar navbarStyle="alt" />

        <div className="flex justify-center mt-[80px]">
          <div className={classNames('px-8 max-w-[900px]', '')}>
            <div className="text-[32px] max-w-[350px] font-bold">
              Love to hear from you, Get in touch
            </div>

            <div className="mt-[32px]">
              <div
                className={classNames(
                  'grid grid-cols-1',
                  'xl:grid-cols-2 xl:space-x-[34px]'
                )}
              >
                <div className={classNames('mb-4', 'xl:mb-0')}>
                  <CInput
                    name="name"
                    type="modal"
                    label="Your Name"
                    placeholder="Enter your name here"
                  />
                </div>
                <div>
                  <CInput
                    name="email"
                    type="modal"
                    label="Your Email"
                    placeholder="Enter your email here"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CInput
                name="subject"
                type="modal"
                label="Subject"
                placeholder="Get a quote / Bugs / Issues"
              />
            </div>

            <div className="mt-4">
              <CInputTextArea
                label="Message"
                placeholder="Let us know what you want to say..."
              />
            </div>

            <div className={classNames('mt-4 flex justify-center', 'xl:block')}>
              <CButton text="Contact Us" buttonStyle="primary" />
            </div>
          </div>
        </div>
      </CPanel>
    </CPage>
  )
}
