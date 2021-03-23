import React from 'react'
import PropTypes from 'prop-types'
import {
  Heading,
  Container,
  Text,
  Flex,
  Box
} from 'ooni-components'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { DetailsBox } from '../DetailsBox'
import AccessPointStatus from '../AccessPointStatus'

export const FacebookMessengerDetails = ({ measurement, render }) => {
  const intl = useIntl()
  const testKeys = measurement.test_keys
  const isWorking = (
    testKeys.facebook_dns_blocking === false &&
    testKeys.facebook_tcp_blocking === false
  )
  const dnsBlocking = testKeys.facebook_dns_blocking === true
  const tcpBlocking = testKeys.facebook_tcp_blocking === true
  const isFailed = (
    testKeys.facebook_dns_blocking === null &&
    testKeys.facebook_tcp_blocking === null
  )
  const tcpConnections = testKeys.tcp_connect

  const messages = defineMessages({
    notReachable: {
      id: 'Measurement.Metadata.FacebookMessenger.NotReachable',
      defaultMessage: 'Facebook Messenger was NOT reachable in {country}',
    },
    reachable: {
      id: 'Measurement.Metadata.FacebookMessenger.Reachable',
      defaultMessage:  'Facebook Messenger was reachable in {country}', 
    }
  })

  let summaryText = ''
  if (!isWorking) {
    if (tcpBlocking) {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.TCPFailure'})
    } else {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.TCPSuccess'})
    }

    summaryText += ' '

    if (dnsBlocking) {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.DNSFailure'})
    } else {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.DNSSuccess'})
    }
  } else {
    summaryText = 'Measurement.Details.SummaryText.FacebookMessenger.Reachable'
  }

  return (
    render({
      status: isWorking ? 'reachable' : 'anomaly',
      statusInfo: isWorking
        ? <FormattedMessage id='Measurement.Status.Hint.FacebookMessenger.Reachable' />
        : <FormattedMessage id='Measurement.Status.Hint.FacebookMessenger.Blocked' />,
      summaryText: summaryText,
      headMetadata: {
        message: isWorking ? messages.reachable : messages.notReachable,
        formatted: false
      },
      details: (
        <React.Fragment>
          <Container>
            <Flex>
              <DetailsBox content={
                <React.Fragment>
                  <Flex>
                    <Box width={1/4}>
                      <AccessPointStatus
                        label={<FormattedMessage id='Measurement.Details.FacebookMessenger.DNS.Label.Title' />}
                        ok={!dnsBlocking}
                      />
                    </Box>
                    <Box width={1/4}>
                      <AccessPointStatus
                        label={<FormattedMessage id='Measurement.Details.FacebookMessenger.TCP.Label.Title' />}
                        ok={!tcpBlocking}
                      />
                    </Box>
                  </Flex>
                  {Array.isArray(tcpConnections) && tcpConnections.length > 0 &&
                  <React.Fragment>
                    <Heading h={4}> <FormattedMessage id='Measurement.Details.FacebookMessenger.Endpoint.Status.Heading' /> </Heading>
                    {tcpConnections.map((connection, index) => (
                      <Flex key={index}>
                        <Box>
                          <Text>
                            {connection.status.failure &&
                            <FormattedMessage id="Measurement.Details.FacebookMessenger.Endpoint.ConnectionTo.Failed"
                              values={{ destination: <strong> {connection.ip}:{connection.port} </strong> }}
                            />
                            }
                            {connection.status.success &&
                              <FormattedMessage id="Measurement.Details.FacebookMessenger.Endpoint.ConnectionTo.Successful"
                                values={{ destination: <strong> {connection.ip}:{connection.port} </strong> }}
                              />
                            }
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </React.Fragment>
                  }
                </React.Fragment>
              } />
            </Flex>
          </Container>
        </React.Fragment>
      )
    })
  )
}
FacebookMessengerDetails.propTypes = {
  measurement: PropTypes.object,
  render: PropTypes.func
}

export default FacebookMessengerDetails
