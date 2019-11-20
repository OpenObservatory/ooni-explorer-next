import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Flex,
  Container,
  Box,
} from 'ooni-components'
import { Text } from 'rebass'
import moment from 'moment'
import { injectIntl, intlShape } from 'react-intl'

import Flag from '../Flag'

const SummaryContainer = styled(Box)`
  background-color: ${props => props.color};
  color: white;
`

const StyledSummaryItemLabel = styled(Text)`
  font-weight: 600;
`

const SummaryItemBox = ({
  label,
  content
}) => (
  <Box width={[1, 1/3]} px={4} py={2}>
    <Text fontSize={24} fontWeight={300}>
      {content}
    </Text>
    <StyledSummaryItemLabel fontSize={16} >
      {label}
    </StyledSummaryItemLabel>
  </Box>
)

SummaryItemBox.propTypes = {
  label: PropTypes.string,
  content: PropTypes.node
}

const CommonSummary = ({
  color,
  measurement,
  country,
  intl
}) => {
  const startTime = measurement.test_start_time
  const network = measurement.probe_asn
  const countryCode = measurement.probe_cc

  const countryBlock = <Flex flexWrap='wrap'>
    <Box mr={2} pb={1} width={1}>
      <Flag countryCode={countryCode} size={60} border />
    </Box>
    <Box>
      {country}
    </Box>
  </Flex>

  return (
    <React.Fragment>
      <SummaryContainer py={4} color={color}>
        <Container>
          <Flex flexWrap='wrap' alignItems='flex-end' justifyContent='space-around'>
            {/*<SummaryItemBox
              label='Network Name'
              content='AT&T Lorem Ipsum Name A.T.T Internationale'
            />*/}
            <SummaryItemBox
              label={intl.formatMessage({ id: 'Measurement.CommonSummary.Label.Country' })}
              content={countryBlock}
            />
            <SummaryItemBox
              label={intl.formatMessage({ id: 'Measurement.CommonSummary.Label.ASN' })}
              content={network}
            />
            <SummaryItemBox
              label={intl.formatMessage({ id: 'Measurement.CommonSummary.Label.DateTime' })}
              content={moment.utc(startTime).format('lll')}
            />
          </Flex>
        </Container>
      </SummaryContainer>
    </React.Fragment>
  )
}

CommonSummary.propTypes = {
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(CommonSummary)
