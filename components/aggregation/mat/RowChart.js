import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'ooni-components'
import { Bar } from '@nivo/bar'

const keys = [
  'anomaly_count',
  'confirmed_count',
  'failure_count',
  'ok_count',
]

const colorMap = {
  'confirmed_count': '#f03e3e', // red7,
  'anomaly_count': '#fab005', // yellow6
  'failure_count': '#ced4da', // gray4
  'ok_count': '#51cf66' // green5
}

const colorFunc = (d) => colorMap[d.id] || '#ccc'

const RowChart = ({ data, index, style, indexBy, label }) => {
  return (
    <Box p={3} style={style}>
      {`${label.key}: ${label.value}`}
      <Bar
        width={960}
        height={130}
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 10, right: 0, bottom: 60, left: 80 }}
        padding={0.3}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        colors={colorFunc}
        axisTop={null}
        axisRight={null}
        xScale={{ type: 'time' }}
        axisBottom={{
          tickSize: 5,
          tickRotation: 45,
          format: value => value
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 2
        }}
        labelSkipWidth={100}
        labelSkipHeight={100}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[]}
        animate={false}
        motionStiffness={90}
        motionDamping={15}
      />

    </Box>
  )
}
RowChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    anomaly_count: PropTypes.number,
    confirmed_count: PropTypes.number,
    failure_count: PropTypes.number,
    input: PropTypes.string,
    measurement_count: PropTypes.number,
    measurement_start_day: PropTypes.string,
    ok_count: PropTypes.number,
  }))
}

export default RowChart