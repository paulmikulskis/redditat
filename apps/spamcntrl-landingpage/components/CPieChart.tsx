import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import _ from 'lodash'

export interface CPieChartProps {
  data: any[]
}
const defaultProps: CPieChartProps = {
  data: [
    {
      id: 'Spam',
      label: 'Spam',
      value: 9,
      color: 'hsl(54, 100%, 62%)',
    },
    {
      id: 'Not Spam',
      label: 'Not Spam',
      value: 39,
      color: 'hsl(207, 90%, 54%)',
    },
  ],
}

const CPieChart: React.FC<CPieChartProps> = ({ data }) => {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      colors={(pie: any) => {
        const found = _.find(data, (d: any) => {
          return d.id == pie.id
        })

        return found.color
      }}
      arcLinkLabelsColor="#1F293E"
      arcLinkLabelsTextColor="#1F293E"
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      theme={{
        fontFamily: 'Gelion',
        labels: {
          text: {
            fontSize: '16px',
          },
        },
      }}
    />
  )
}

CPieChart.defaultProps = defaultProps
export default CPieChart
