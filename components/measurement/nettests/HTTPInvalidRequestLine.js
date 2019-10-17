import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

const HttpInvalidRequestLineDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const isAnomaly = testKeys.tampering === true
  const isOK = testKeys.tampering === false
  const isFailed = testKeys.tampering === null

  const sentMessages = testKeys.sent
  const receivedMessages = testKeys.received
  return (
    render({
      status: isAnomaly ? 'anomaly' : 'reachable',
      statusLabel: isAnomaly
        ? <FormattedMessage id='Measurement.Hero.Status.HTTPInvalidReqLine.MiddleboxesDetected' />
        : <FormattedMessage id='Measurement.Hero.Status.HTTPInvalidReqLine.NoMiddleBoxes' />,
      summaryText: isAnomaly
        ? 'Measurement.HTTPInvalidReqLine.MiddleboxesDetected.SummaryText'
        : 'Measurement.HTTPInvalidReqLine.NoMiddleBoxes.SummaryText',
      details: (
        <div>
          {/*<Text>isAnomaly: {isAnomaly.toString()}</Text>
            <Text>isOK: {isOK.toString()}</Text>
          <Text>isFailed: {isFailed.toString()}</Text>
          <Text>sentMessages: {sentMessages.toString()}</Text>
          <Text>receivedMessages: {receivedMessages.toString()}</Text>*/}
        </div>
      )}
    )
  )
}

HttpInvalidRequestLineDetails.propTypes = {
  testKeys: PropTypes.object
}

export default HttpInvalidRequestLineDetails
