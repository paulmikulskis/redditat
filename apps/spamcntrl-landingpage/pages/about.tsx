import classNames from 'classnames'
import CButton from '../components/CButton'
import CFooter from '../components/CFooter'
import CInput from '../components/CInput'
import CInputTextArea from '../components/CInputTextArea'
import CNavbar from '../components/CNavbar'
import CPage from '../components/CPage'
import CPanel from '../components/CPanel'

export default function About() {
  return (
    <CPage>
      <CPanel className="min-h-[750px]">
        <CNavbar navbarStyle="alt" />

        <div className="flex justify-center mt-[80px]">
          <div className={classNames('px-8 max-w-[900px]', '')}>
            <div className="text-[32px] max-w-[350px] font-bold">About Us</div>

            <div className="text-lnk text-base w-full text-left pb-[100px]">
              <p className="mt-[32px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse ut volutpat odio. Donec aliquam magna nec urna
                placerat, quis finibus felis accumsan. Aliquam massa tortor,
                vestibulum vitae purus vitae, sodales maximus quam. Ut
                pellentesque, ligula sed vehicula imperdiet, massa odio gravida
                dui, eget hendrerit erat ante tincidunt massa. Orci varius
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Maecenas condimentum massa sed nisl pretium, ut
                bibendum ex rutrum. Praesent vel pretium dolor, vel vulputate
                metus. Donec viverra eleifend velit eu volutpat. Nulla tristique
                interdum turpis a tincidunt. Cras nec porta risus. Aenean id
                neque eu velit consectetur laoreet id in nunc. Nam vitae
                consequat magna, vel egestas nulla.
              </p>
              <br />
              <p>
                Maecenas sem elit, accumsan in convallis vel, dignissim et est.
                Etiam egestas turpis lectus, vel malesuada elit ultricies eu.
                Fusce mollis ultricies nunc venenatis euismod. Curabitur sed
                sapien vitae ante rhoncus gravida. Praesent auctor leo leo, in
                pretium purus vestibulum in. Vivamus volutpat vel lectus sit
                amet malesuada. Nunc eu nulla turpis.
              </p>
            </div>
          </div>
        </div>
      </CPanel>
    </CPage>
  )
}
