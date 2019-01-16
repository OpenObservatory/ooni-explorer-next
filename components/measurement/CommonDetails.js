/* global require */
import React from 'react'
import PropTypes from 'prop-types'

import {
  Heading,
  Button,
  Flex,
  Box,
  theme
} from 'ooni-components'

import NoSSR from 'react-no-ssr'
import { injectIntl, intlShape } from 'react-intl'

import DetailsBox from './DetailsBox'

// We wrap the json viewer so that we can render it only in client side rendering
class JsonViewer extends React.Component {
  render() {
    const ReactJson = require('react-json-view').default
    const {
      src
    } = this.props
    return (
      <ReactJson src={src} />
    )
  }
}

JsonViewer.propTypes = {
  src: PropTypes.object.isRequired
}

const CommonDetails = ({
  measurement,
  measurementURL,
  intl
}) => {
  const {
    report_id,
    software_version,
    annotations: {
      engine_version,
      platform
    }
  } = measurement

  const downloadFilename = `ooni-measurement-${report_id}.json`
  const items = [
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Labels.MsmtID' }),
      value: report_id
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Labels.Platform' }),
      value: platform ? platform : 'unknown'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Labels.SoftwareVersion' }),
      value: software_version
    }
  ]
  if(engine_version) {
    items.push({
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Labels.MKVersion' }),
      value: engine_version
    })
  }
  return (
    <React.Fragment>
      <Flex my={4}>
        <DetailsBox
          title={intl.formatMessage({ id: 'Measurement.CommonDetails.OtherDetails.Heading' })}
          items={items}
          bg={theme.colors.gray2}
        />
      </Flex>
      <Box>
        <Flex px={3} alignItems='center' bg={theme.colors.gray2}>
          <Box>
            <Heading h={4}>{intl.formatMessage({ id: 'Measurement.CommonDetails.RawMeasurement.Heading' })}</Heading>
          </Box>
          <Box >
            <a href={measurementURL} download={downloadFilename}>
              <Button
                fontSize={11}
                mx={3}
                px={3}>Download JSON</Button>
            </a>
          </Box>
        </Flex>
        <Flex bg='WHITE' p={3}>
          <NoSSR>
            <JsonViewer src={measurement} />
          </NoSSR>
        </Flex>
      </Box>
    </React.Fragment>
  )
}

CommonDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  measurementURL: PropTypes.string.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(CommonDetails)
