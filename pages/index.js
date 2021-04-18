import TopNavigation from "components/navigation/TopNavigation"
import getConfig from 'next/config'
import dynamic from "next/dynamic"
import { Button, Col, Modal, Radio, Row, Slider } from "antd"
import React, { useCallback, useState } from "react"
import { useRouter } from "next/router"
import useText from "lib/useText"

const theme = getConfig()?.publicRuntimeConfig?.themeVariables

const GlobeNoSSR = dynamic( () => import( "components/geo/GlobeNoSSR" ),
	{ ssr: false } )

export default function Home() {
	const router = useRouter()
	const { getText } = useText()
	const [ year, set_year ] = useState( 2019 )
	const [ country, set_country ] = useState( undefined )
	const [ tooltipVisible, set_tooltipVisible ] = useState( false )
	const [ dataKeyName, set_dataKeyName ] = useState( 'production' )

	const handleChangeKeyName = useCallback( event => {
		set_dataKeyName( event.target.value )
	}, [] )

	return (
		<div className="page">

			<TopNavigation/>

			<div className="aspect-order">
				<div className="content-block globe-controls aspect-controlled">
					<Row gutter={[ 4, 12 ]}>
						<Col xs={24} md={16}>
							<Slider
								trackStyle={{ height: '12px' }}
								railStyle={{ height: '12px' }}
								handleStyle={{ height: '22px', width: '22px' }}
								tooltipVisible={tooltipVisible}
								min={1970}
								max={2021}
								onChange={set_year}
								value={year}
							/>
						</Col>
						<Col xs={24} md={8} style={{ textAlign: 'center' }}>
							<Radio.Group
								options={[
									{ label: 'PRODUCTION', value: 'production' },
									{ label: 'RESERVES', value: 'reserves' },
								]}
								onChange={handleChangeKeyName}
								value={dataKeyName}
								optionType="button"
								buttonStyle="solid"
							/>
						</Col>
					</Row>
				</div>

				<div className="content-block">
					<GlobeNoSSR
						onGlobeReady={() => set_tooltipVisible( true )}
						onCountryClick={set_country}
						year={year}
						dataKeyName={dataKeyName}
					/>
				</div>
			</div>

			{!!country &&
			<Modal
				visible={country?.name?.length > 0}
				onCancel={() => set_country( undefined )}
				footer={null}
			>
				<h1>{country?.name}</h1>

				<table>
					<tbody>
						<tr>
							<td>{getText( 'population' )} &nbsp;</td>
							<td align="right">{Math.round( country.popEst / 1000000 )}M</td>
						</tr>
						<tr>
							<td>{getText( 'production' )}&nbsp;</td>
							<td align="right">1 M tons CO²</td>
						</tr>
						<tr>
							<td>{getText( 'reserves' )}&nbsp;</td>
							<td align="right">1 M tons CO²</td>
						</tr>
					</tbody>
				</table>

				<Button
					type="primary"
					block style={{ marginTop: 24 }}
					onClick={() => {
						set_country( undefined )
						router.push( 'co2?country=' + country.isoA2?.toLowerCase() )
					}}
				>
					{getText( 'co2_forecast' )}
				</Button>
			</Modal>}

			<style jsx>{`
              .aspect-order {
                display: flex;
                flex-direction: column;
              }

              @media (max-aspect-ratio: 1/1) {
                .aspect-controlled {
                  order: 3;
                }
              }

			`}
			</style>

		</div>
	)
}

export { getStaticProps } from '../lib/getStaticProps'
