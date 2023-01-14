import React from 'react'
import CButton from './CButton'
import CInput from './CInput'
import CInputCardExpiryDate from './CInputCardExpiryDate'
import CInputCardNumber from './CInputCardNumber'
import CModal from './CModal'

export interface CAddCardButtonProps {
  onClickAddCard?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
const defaultProps: CAddCardButtonProps = {}

const CAddCardButton: React.FC<CAddCardButtonProps> = ({ onClickAddCard }) => {
  const [showModal, setShowModal] = React.useState<boolean>(false)

  function _onClickAddCard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onClickAddCard && onClickAddCard(e)
    setShowModal(true)
  }

  function hideAddCardModal() {
    setShowModal(false)
  }

  return (
    <div>
      <CButton
        buttonStyle="primary"
        text={'+ Add Card'}
        style={{ width: '100px' }}
        onClick={_onClickAddCard}
      />

      <CModal
        hasOkCancelButton={false}
        cancel={async () => {
          hideAddCardModal()
        }}
        show={showModal}
        title="Add a Card"
        content={
          <div>
            <div>
              <CInput
                type="modal"
                placeholder="Type Card Holder Name"
                label="Card Holder Name"
              />
            </div>
            <div className="mt-3">
              <CInputCardNumber label="Card Number" />
            </div>
            <div className="mt-3 flex justify-between">
              <span className="w-[114px]">
                <CInputCardExpiryDate label="Expiry Date" />
              </span>
              <span className="w-[114px]">
                <CInput type="modal" placeholder="Type CVC" label="CVC" />
              </span>
            </div>
            <div className="mt-3 flex justify-center">
              <CButton
                text="Add"
                buttonStyle="primary"
                style={{ width: '120px' }}
              />
            </div>
          </div>
        }
      />
    </div>
  )
}

CAddCardButton.defaultProps = defaultProps
export default CAddCardButton
