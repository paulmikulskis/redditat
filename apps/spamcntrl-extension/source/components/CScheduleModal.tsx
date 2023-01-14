import React from 'react'
import CButton from './CButton'
import CDropdownButton from './CDropdownButton'
import CModal, { CModalProps } from './CModal'

interface CScheduleModalProps extends CModalProps {}
const defaultProps: CScheduleModalProps = {}

const CScheduleModal: React.FC<CScheduleModalProps> = ({ ...props }) => {
  return (
    <CModal
      hasOkCancelButton={false}
      title="Schedule Videos"
      content={
        <div>
          <div className="grid grid-cols-3">
            <span>
              <CDropdownButton
                label={'Day'}
                text={13}
                menuOptions={[{ key: '13', title: '13' }]}
                buttonStyle={'modal'}
                style={{ width: '72px' }}
              />
            </span>
            <span>
              <CDropdownButton
                label={'Month'}
                text={'Oct'}
                menuOptions={[{ key: 'Oct', title: 'Oct' }]}
                buttonStyle={'modal'}
                style={{ width: '72px' }}
              />
            </span>
            <span>
              <CDropdownButton
                label={'Year'}
                text={'2022'}
                menuOptions={[{ key: '2022', title: '2022' }]}
                buttonStyle={'modal'}
                style={{ width: '72px' }}
              />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3">
            <span>
              <CDropdownButton
                label={'Hour'}
                text={'09'}
                menuOptions={[{ key: '09', title: '09' }]}
                buttonStyle={'modal'}
                style={{ width: '72px' }}
              />
            </span>
            <span>
              <CDropdownButton
                label={'Minute'}
                text={'30'}
                menuOptions={[{ key: '30', title: '30' }]}
                buttonStyle={'modal'}
                style={{ width: '72px' }}
              />
            </span>
            <span>
              <CDropdownButton
                label={<span className="invisible">AM/PM</span>}
                text={'AM'}
                menuOptions={[
                  { key: 'AM', title: 'AM' },
                  { key: 'PM', title: 'PM' },
                ]}
                buttonStyle={'modal'}
                style={{ width: '72px' }}
              />
            </span>
          </div>

          <div className="mt-4 w-full">
            <CDropdownButton
              style={{
                width: '100%',
              }}
              label={'Recurring Schedule in:'}
              text={'Every Week'}
              buttonStyle={'modal'}
              menuOptions={[
                { key: 'Every Day', title: 'Every Day' },
                { key: 'Every Week', title: 'Every Week' },
                { key: 'Every Month', title: 'Every Month' },
              ]}
            />
          </div>

          <div className="mt-4 flex justify-center w-full">
            <CButton
              text={'Schedule'}
              style={{ width: '120px' }}
              buttonStyle="primary"
            />
          </div>
        </div>
      }
      {...props}
    />
  )
}

CScheduleModal.defaultProps = defaultProps
export default CScheduleModal
