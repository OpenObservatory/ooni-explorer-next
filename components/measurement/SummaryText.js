import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { Flex, Text } from 'ooni-components'

import { getTestMetadata } from '../utils'
import FormattedMarkdown from '../FormattedMarkdown'

const SummaryText = ({
  testName,
  network,
  country,
  date,
  content,
}) => {
  const intl = useIntl()
  const metadata = getTestMetadata(testName)
  const formattedDate = moment(date).format('LL')
  const formattedDateTime = intl.formatDate(moment.utc(date).toDate(), {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })

  let textToRender = null
  if (typeof content === 'function') {
    textToRender = content()
  } else if (typeof content === 'string') {
    textToRender =
      <FormattedMarkdown id={content}
        values={{
          testName: `[${metadata.name}](${metadata.info})`,
          network: network,
          country: country,
          date: `<abbr title='${formattedDateTime}'>${formattedDate}</abbr>`
        }}
      />
  } else {
    textToRender = content
  }
  return (
    <Flex>
      <Text py={4} fontSize={20}>
        {textToRender}
      </Text>
    </Flex>
  )
}

SummaryText.propTypes = {
  testName: PropTypes.string.isRequired,
  network: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  country: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func
  ])
}

export default SummaryText
