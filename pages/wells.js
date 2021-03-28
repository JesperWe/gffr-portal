import TopNavigation from "components/navigation/TopNavigation"
import getConfig from 'next/config'
import { ipLocationSelector, useStore } from "lib/zustandProvider"
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react"

const theme = getConfig()?.publicRuntimeConfig?.themeVariables

const MapWithNoSSR = dynamic( () => import("components/geo/Leaflet"),
	{ ssr: false } )

export default function Wells( props ) {
	//const texts = useStore( textsSelector )
	const ipLocation = useStore( ipLocationSelector )

	const [ lat, set_lat ] = useState( 0 )
	const [ lng, set_lng ] = useState( 0 )

	useEffect( () => {
			if( !ipLocation ) return
			set_lat( ipLocation.lat )
			set_lng( ipLocation.lon )
		},
		[ ipLocation ] )

	return (
		<>
			<div className="page">
				<TopNavigation/>

				<div className="map">
					<MapWithNoSSR lat={lat} lng={lng}/>
				</div>

				<style jsx>{`
				`}</style>

			</div>
		</>
	)
}

export { getStaticProps } from '../lib/getStaticProps'
