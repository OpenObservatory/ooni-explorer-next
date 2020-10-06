import React from 'react'

import WebConnectivityDetails from './nettests/WebConnectivity'
import TelegramDetails from './nettests/Telegram'
import WhatsAppDetails from './nettests/WhatsApp'
import DashDetails from './nettests/Dash'
import NdtDetails from './nettests/Ndt'

import FacebookMessengerDetails from './nettests/FacebookMessenger'
import HttpHeaderFieldManipulationDetails from './nettests/HTTPHeaderFieldManipulation'
import HttpInvalidRequestLine from './nettests/HTTPInvalidRequestLine'

import VanillaTorDetails from './nettests/VanillaTor'
import PsiphonDetails from './nettests/Psiphon'
import TorDetails from './nettests/Tor'

import DefaultTestDetails from './nettests/Default'
import MeasurementNotFound from './MeasurementNotFound'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
  dash: DashDetails,
  ndt: NdtDetails,
  whatsapp: WhatsAppDetails,
  facebook_messenger: FacebookMessengerDetails,
  telegram: TelegramDetails,
  http_header_field_manipulation: HttpHeaderFieldManipulationDetails,
  http_invalid_request_line: HttpInvalidRequestLine,
  vanilla_tor: VanillaTorDetails,
  psiphon: PsiphonDetails,
  tor: TorDetails
}

const MeasurementContainer = ({ measurement, ...props }) => {
  if (measurement === undefined) {
    return <MeasurementNotFound />
  }

  const TestDetails = mapTestDetails[measurement.test_name] || DefaultTestDetails
  return <TestDetails measurement={measurement} {...props} />
}

export default MeasurementContainer
