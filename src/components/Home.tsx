import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { StateContext } from '../store';
import { HEADER_HEIGHT } from '../theme';
import Header from './Header';
import Map from './Map';
import { layerStyles, mapStyle } from './Map/styles';
import SiteDetails from './SiteDetails';
import SiteCases from './SiteCases';

interface Refs {
    map?: maplibregl.Map;
    bounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    hoveredSite?: string;
}

const Home = (): JSX.Element => {
    const { state, dispatch } = React.useContext(StateContext);

    const refs = React.useRef<Refs>({
        map: undefined,
        bounds: state.sitesBounds,
        selectedSite: undefined,
        hoveredSite: undefined
    });

    const sitesBounds = React.useRef(state.sitesBounds);

    React.useEffect(() => {
        if (refs.current.map) {
            const map = refs.current.map;
            if (refs.current.selectedSite) {
                map.setFeatureState({ source: 'sites', id: refs.current.selectedSite.name }, { selected: false });
            }
            if (state.selectedSite) {
                map.setFeatureState({ source: 'sites', id: state.selectedSite.name }, { selected: true });
            }
        }
        refs.current.selectedSite = state.selectedSite;
    }, [state.selectedSite]);

    const onMapLoad = (map: maplibregl.Map) => {
        map.addSource('sites', {
            type: 'geojson',
            data: state.sites,
            promoteId: 'name'
        });

        map.addLayer({
            ...layerStyles.sites.default,
            id: 'sites',
            source: 'sites'
        } as maplibregl.CircleLayerSpecification);

        map.on('click', 'sites', (e) => {
            if (e.features && e.features.length > 0) {
                const site =
                    e.features[0].id === refs.current.selectedSite?.name ? undefined : e.features[0].properties;
                dispatch({
                    type: 'updateSelectedSite',
                    site
                });
            }
        });

        map.on('mouseenter', 'sites', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'sites', () => {
            map.getCanvas().style.cursor = '';
        });

        refs.current.map = map;
    };

    const handleSiteClick = (site: SiteProps) => {
        dispatch({ type: 'updateSelectedSite', site });
        handleSiteMouseLeave();
    };

    const handleSiteMouseEnter = (siteId: string) => {
        if (refs.current.map) {
            if (refs.current.hoveredSite) {
                refs.current.map.setFeatureState({ source: 'sites', id: refs.current.hoveredSite }, { hovered: false });
            }
            refs.current.map.setFeatureState({ source: 'sites', id: siteId }, { hovered: true });
            refs.current.hoveredSite = siteId;
        }
    };

    const handleSiteMouseLeave = () => {
        if (refs.current.map) {
            if (refs.current.hoveredSite) {
                refs.current.map.setFeatureState({ source: 'sites', id: refs.current.hoveredSite }, { hovered: false });
                refs.current.hoveredSite = undefined;
            }
        }
    };

    return (
        <>
            <Header />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: `calc(100% - ${HEADER_HEIGHT}px)`
                }}
            >
                <Box sx={{ display: 'flex', height: '50%' }}>
                    <Box sx={{ width: '50%', overflowY: 'auto', p: 1 }}>
                        {state.selectedSite ? (
                            <SiteDetails site={state.selectedSite} />
                        ) : (
                            <>
                                <Typography variant="h4">Sites</Typography>
                                <Alert sx={{ m: 1 }} severity="info">
                                    Start by selecting a site from the list below or on the map.
                                </Alert>
                                {state.sites &&
                                    state.sites.features.map(({ properties }) => (
                                        <Chip
                                            key={properties.name}
                                            sx={{ m: 1 }}
                                            label={properties.name}
                                            variant="outlined"
                                            onClick={() => handleSiteClick(properties)}
                                            onMouseEnter={() => handleSiteMouseEnter(properties.name)}
                                            onMouseLeave={handleSiteMouseLeave}
                                        />
                                    ))}
                            </>
                        )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Map
                            mapOptions={{
                                style: mapStyle,
                                minZoom: 1,
                                fitBoundsOptions: {
                                    padding: 100
                                }
                            }}
                            initialBounds={sitesBounds.current}
                            attribution
                            help
                            navigation
                            onLoad={onMapLoad}
                        />
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ flexGrow: 1, p: 1 }}>
                    {state.selectedSite ? <SiteCases site={state.selectedSite} /> : null}
                </Box>
            </Box>
        </>
    );
};

export default Home;
