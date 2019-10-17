import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'
import axios from 'axios'
import styled from 'styled-components'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import debounce from 'lodash.debounce'
import {
  Flex, Box,
  Container,
  Link, Input,
  Heading,
} from 'ooni-components'
import { Text } from 'rebass'
import { StickyContainer, Sticky } from 'react-sticky'

import Flag from '../components/Flag'
import Layout from '../components/Layout'
import NavBar from '../components/NavBar'

import countryUtil from 'country-util'

const CountryLink = styled(Link)`
  color: ${props => props.theme.colors.black};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.blue5};
  }
`

const StyledCountryCard = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
`

const Divider = styled.div`
  border: 1px solid ${props => props.theme.colors.gray3};
  margin-bottom: 12px;
`

const CountryBlock = ({countryCode, msmtCount}) => {
  const href = `/country/${countryCode}`
  return (
    <Box width={[1/2, 1/4]} my={3} px={3}>
      <StyledCountryCard p={3}>
        <NLink href={href}>
          <CountryLink href={href}>
            <Flex flexDirection='column'>
              <Flag center border countryCode={countryCode} size={48} />
              <Text py={2} fontSize={[20, 24]} style={{height: '80px'}}>{countryUtil.territoryNames[countryCode]}</Text>
              <Divider />
              <Flex alignItems={['flex-start', 'center']} flexDirection={['column', 'row']}>
                <Text mr={2} fontSize={20} fontWeight={600} color='blue9'><FormattedNumber value={msmtCount} /></Text>
                <Text>Measurements</Text>
              </Flex>
            </Flex>
          </CountryLink>
        </NLink>
      </StyledCountryCard>
    </Box>
  )
}

// To compenstate for the sticky navigation bar
// :target selector applies only the element with id that matches
// the current URL fragment (e.g '/#Africa')
const RegionHeaderAnchor = styled.div`
  :target::before {
    content: ' ';
    display: block;
    width: 0;
    /* Height of the combined header (NavBar and Regions) */
    height: 145px;
    margin-top: -145px;
  }
`

const RegionBlock = ({regionCode, countries}) => {
  const regionName = countryUtil.territoryNames[regionCode]
  // Select countries in the region where we have measuremennts from
  const measuredCountriesInRegion = countryUtil.regions[regionCode].countries.filter((countryCode) => (
    countries.find((item) => item.alpha_2 === countryCode)
  ))

  // When there are no measurements from the region
  if (measuredCountriesInRegion.length === 0) {
    return null
  }

  return (
    <Box my={3}>
      <RegionHeaderAnchor id={regionName} />
      <Heading h={1} center py={2}>{regionName}</Heading>
      <Flex flexWrap='wrap' py={2}>
        {countries
          .filter((c => ( measuredCountriesInRegion.indexOf(c.alpha_2) > -1 )))
          .map((country, index) => (
            <CountryBlock key={index} countryCode={country.alpha_2} msmtCount={country.count} />
          ))
        }
      </Flex>
    </Box>
  )
}

// Raise the Sticky Header to avoid the flags getting rendered over it
const RaisedHeader = styled.div`
  z-index: 100;
`

const RegionMenu = styled.div`
  background-color: white;
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

const StyledRegionLink = styled.a`
  color: ${props => props.theme.colors.blue5};
  text-decoration: none;
`

const RegionLink = ({ href, label }) => (
  <Box px={3} py={4}>
    <StyledRegionLink href={href}>
      <Text fontSize={20}>{label}</Text>
    </StyledRegionLink>
  </Box>
)


const NoCountriesFound = ({ searchTerm }) => (
  <Flex justifyContent='center'>
    <Box width={1/2} m={5}>
      <Text textAlign='center' fontSize={5}>
        {/* TODO Add to copy */}
        <FormattedMessage
          id='Countries.Search.NoCountriesFound'
          values={{ searchTerm }}
        />
      </Text>
    </Box>
  </Flex>
)

class Countries extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initial: true,
      searchTerm: '',
      filteredCountries: []
    }
    this.onSearchChange = debounce(this.onSearchChange, 200)
  }

  static async getInitialProps () {
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/countries')

    // Sort countries by name (instead of by country codes)
    result.data.countries.sort((a,b) => a.name < b.name ? -1 : 1)

    return {
      countries: result.data.countries
    }
  }

  onSearchChange (searchTerm) {
    const filteredCountries = this.props.countries.filter((country) => (
      country.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    ))
    this.setState({
      filteredCountries,
      searchTerm
    })
  }

  static getDerivedStateFromProps (props, state) {
    if (state.filteredCountries.length === 0 && state.initial === true) {
      return {
        filteredCountries: props.countries,
        initial: false
      }
    }
    return state
  }

  render () {
    const { filteredCountries, searchTerm } = this.state
    // Africa Americas Asia Europe Oceania Antarctica
    const regions = ['002', '019', '142', '150', '009', 'AQ']

    return (
      <Layout>
        <Head>
          <title>Internet Censorship around the world - OONI Explorer</title>
        </Head>

        <StickyContainer>
          <Sticky>
            {({ style }) => (
              <RaisedHeader style={style}>
                <NavBar />
                <RegionMenu>
                  <Container>
                    <Flex justifyContent='space-around' alignItems='center'>
                      <RegionLink href="#Africa" label='Africa' />
                      <RegionLink href="#Americas" label='Americas' />
                      <RegionLink href="#Asia" label='Asia' />
                      <RegionLink href="#Europe" label='Europe' />
                      <RegionLink href="#Oceania" label='Oceania' />
                      <Box>
                        <Input
                          onChange={(e) => this.onSearchChange(e.target.value)}
                          placeholder='Search for Countries'
                          error={filteredCountries.length === 0}
                        />
                      </Box>
                    </Flex>
                  </Container>
                </RegionMenu>
              </RaisedHeader>
            )}
          </Sticky>
          <Container>
            {
              // Show a message when there are no countries to show, when search is empty
              (filteredCountries.length === 0)
                ? <NoCountriesFound searchTerm={searchTerm} />
                : regions.map((regionCode, index) => (
                  <RegionBlock key={index} regionCode={regionCode} countries={filteredCountries} />
                ))
            }
          </Container>
        </StickyContainer>
      </Layout>
    )
  }
}

export default Countries
