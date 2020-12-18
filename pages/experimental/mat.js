/* global process */
import React, { useCallback, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from  'next/router'
import axios from 'axios'
import {
  Container,
  Heading,
  Flex, Box, Text
} from 'ooni-components'
import useSWR from 'swr'

import Layout from '../../components/Layout'
import NavBar from '../../components/NavBar'
import { StackedBarChart } from '../../components/aggregation/mat/Charts'
import { Form } from '../../components/aggregation/mat/Form'

const baseURL = process.env.MEASUREMENTS_URL

export const getServerSideProps = async () => {
  const testNamesR = await axios.get(`${baseURL}/api/_/test_names`)
  if (Array.isArray(testNamesR.data.test_names)){
    return {
      props: {
        testNames: testNamesR.data.test_names
      }
    }
  } else {
    return {
      testNames: []
    }
  }
}

const swrOptions = {
  revalidateOnFocus: false,
}

const fetcher = (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${baseURL}/api/v1/aggregation?${qs}`
  return axios.get(reqUrl).then(r => {
    return r.data
  })
}


const MeasurementAggregationToolkit = ({ testNames }) => {

  const router = useRouter()

  const onSubmit = useCallback((data) => {
    let params = {}
    for (const p of Object.keys(data)) {
      if (data[p] !== '') {
        params[p] = data[p]
      }
    }
    const href = {
      pathname: router.pathname,
      query: params,
    }
    return router.push(href, href, { shallow: true })

  }, [router.pathname])

  const shouldFetchData = router.pathname !== router.asPath
  const query = router.query

  const { data, error, isValidating } = useSWR(
    () => shouldFetchData ? [query] : null,
    fetcher,
    swrOptions
  )

  const chartMeta = useMemo(() => {
    // TODO Move charting related transformations to Charts.js
    if (data) {
      let cols = [
        'anomaly_count',
        'confirmed_count',
        'failure_count',
        'measurement_count',
      ]
      let indexBy = ''
      cols.push(query['axis_x'])
      indexBy = query['axis_x']

      return {
        data: data.result,
        dimensionCount: data.dimension_count,
        // TODO Get response time from axios
        // url: resp.request.responseURL,
        url: '',
        cols,
        indexBy
      }
    } else {
      return null
    }
  }, [data, query])

  return (
    <Layout>
      <Head>
        <title>OONI MAT</title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1} my={4}>OONI Measurement Aggregation Toolkit</Heading>
        <Form onSubmit={onSubmit} testNames={testNames} query={router.query} />
        <Flex flexDirection='column'>
          {isValidating &&
            <Box>
              <h2>Loading ...</h2>
            </Box>
          }
          {chartMeta && chartMeta.dimensionCount == 1 &&
            <Box style={{height: '50vh'}}>
              <StackedBarChart data={chartMeta.data} cols={chartMeta.cols} indexBy={chartMeta.indexBy} />
            </Box>
          }
          {chartMeta && chartMeta.dimensionCount > 1 &&
            <Flex alignItems='center' justifyContent='center' flexWrap='wrap'>
              <Text fontSize={64}>🚧</Text>
              <Heading h={3}  mx={4}>
                Two dimensional charts coming soon.
              </Heading>
              <Text fontSize={64}>🚧</Text>
              <br />
              <Box width={1} style={{height: '30vh', 'overflow-y': 'scroll'}} >
                <pre>{JSON.stringify(chartMeta, null, 2)}</pre>
              </Box>
            </Flex>
          }
          <Box>
            {chartMeta && chartMeta.url}
            {chartMeta && ` (dimensions: ${chartMeta.dimensionCount})`}
          </Box>
          <Box>
            {/* loadTime && <span>Load time: {loadTime} ms</span> */}
          </Box>
          {error && <Box>
            <Heading h={5} my={4}>Error</Heading>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Box>}
        </Flex>
      </Container>
    </Layout>
  )
}

export default MeasurementAggregationToolkit
