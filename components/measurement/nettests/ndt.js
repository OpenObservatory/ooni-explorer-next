import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'

import { mlabServerToCountry, mlabServerToName } from './mlab_utils.js'

const NdtDetails = ({testKeys}) => {
  const isFailed = testKeys.failure !== null
  const failure = testKeys.failure

  const simple = testKeys.simple || {}
  const advanced = testKeys.advanced || {}

  // XXX we probably want to use a utility function to convert to other units,
  // ex. use kbit/s if the speed is low and gbit/s if it's high
  const downloadMbit = simple.download && (simple.download / 1000).toFixed(2)
  const uploadMbit = simple.upload && (simple.upload / 1000).toFixed(2)
  const ping = simple.ping && (simple.ping).toFixed(1)


  // XXX this doesn't actually work as expected see: #mlab channel
  const serverCountry = testKeys.server_address && mlabServerToCountry(testKeys.server_address)
  const serverName = testKeys.server_address && mlabServerToName(testKeys.server_address)

  // Advanced
  const packetLoss = advanced.packet_loss && (advanced.packet_loss * 100).toFixed(3)
  const outOfOrder = advanced.out_of_order && (advanced.out_of_order * 100).toFixed(1)
  const minRTT = advanced.min_rtt && (advanced.min_rtt).toFixed(0)
  const maxRTT = advanced.max_rtt && (advanced.max_rtt).toFixed(0)
  const mss = advanced.mss
  const timeouts = advanced.timeouts

  return (
    <div>
      <Text>isFailed: {'' + isFailed}</Text>
      <Text>failure: {failure}</Text>
      <Text>downloadMbit: {'' + downloadMbit}</Text>
      <Text>uploadMbit: {'' + uploadMbit}</Text>
      <Text>ping: {'' + ping}</Text>

      <Text>serverCountry: {'' + serverCountry}</Text>
      <Text>serverName: {'' + serverName}</Text>
      <Text>packetLoss: {'' + packetLoss}</Text>
      <Text>outOfOrder: {'' + outOfOrder}</Text>
      <Text>minRTT: {'' + minRTT}</Text>
      <Text>maxRTT: {'' + maxRTT}</Text>
      <Text>mss: {'' + mss}</Text>
      <Text>timeouts: {'' + timeouts}</Text>
    </div>
  )
}

NdtDetails.propTypes = {
  testKeys: PropTypes.object
}

export default NdtDetails