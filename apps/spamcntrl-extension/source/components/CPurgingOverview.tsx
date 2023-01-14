import React from 'react'
import CDropdownButton from './CDropdownButton'

interface CPurgingOverviewTotalProps {
  value: string
  label: string
}
const CPurgingOverviewTotalBox: React.FC<CPurgingOverviewTotalProps> = ({
  value,
  label,
}) => {
  return (
    <span
      className="c-purge-ovw-total bg-alt rounded-databox px-4"
      style={{
        paddingTop: '11px',
        paddingBottom: '11px',
      }}
    >
      <div className="font-black text-primary text-base">{value}</div>
      <div className="font-[450] text-sm text-lnk">{label}</div>
    </span>
  )
}

interface CPurgingOverviewProps {}
const defaultProps: CPurgingOverviewProps = {}

const CPurgingOverview: React.FC<CPurgingOverviewProps> = ({}) => {
  return (
    <div>
      <div className="flex justify-between">
        <span className="font-bold text-title text-txt">Purging Overview</span>
        <span>
          <CDropdownButton
            buttonStyle="alt"
            text="1 month"
            menuOptions={[
              {
                key: '1d',
                title: '1 day',
              },
              {
                key: '1w',
                title: '1 week',
              },
              {
                key: '1m',
                title: '1 month',
              },
              {
                key: '1y',
                title: '1 year',
              },
            ]}
          />
        </span>
      </div>

      <div
        style={{
          marginTop: '14px',
        }}
        className="flex justify-between"
      >
        <CPurgingOverviewTotalBox value="12" label="Total Video" />
        <CPurgingOverviewTotalBox value="2.3k" label="Comments" />
        <CPurgingOverviewTotalBox value="245" label="Spam" />
      </div>

      <div className="w-full mt-3 c-purge-ovw-graph bg-alt rounded-databox">
        <div className="flex justify-between items-center">
          <span className="font-bold text-title text-txt">Purging Stats</span>
          <span className="flex items-center">
            <span>
              <CDropdownButton
                buttonStyle="box-alt"
                text="Spam"
                menuOptions={[
                  {
                    key: 'spam',
                    title: 'Spam',
                  },
                  {
                    key: 'not-spam',
                    title: 'Not Spam',
                  },
                ]}
              />
            </span>
            <span className="ml-3">
              <CDropdownButton
                buttonStyle="box-alt"
                text="1 month"
                menuOptions={[
                  {
                    key: '1d',
                    title: '1 day',
                  },
                  {
                    key: '1w',
                    title: '1 week',
                  },
                  {
                    key: '1m',
                    title: '1 month',
                  },
                  {
                    key: '1y',
                    title: '1 year',
                  },
                ]}
              />
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

CPurgingOverview.defaultProps = defaultProps
export default CPurgingOverview
