import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { MapRef, Source, Layer, ViewState } from 'react-map-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PayGapData {
  state: string;
  y_m: string;
  males: number;
  females: number;
  difference: number;  // Add this line to include the difference field
}

const stateNameMapping: { [key: string]: string } = {
  "NT": "Northern Territory",
  "NSW": "New South Wales",
  "VIC": "Victoria",
  "QLD": "Queensland",
  "SA": "South Australia",
  "WA": "Western Australia",
  "TAS": "Tasmania",
  "ACT": "Australian Capital Territory"
};

const MapComponent: React.FC = () => {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: -25.2744,
    longitude: 133.7751,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const [selectedDate, setSelectedDate] = useState<string>("2019-05");
  const [payGapData, setPayGapData] = useState<PayGapData[]>([]);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const mapRef = useRef<MapRef>(null);

  const mapboxToken = 'pk.eyJ1IjoieHlhbjAxNDUiLCJhIjoiY20wM3gwaG82MDJldjJxcHZ6bHExbWlqZSJ9.jLPRzC1D5LocMzCjCXFATw';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap');
        const parsedData: PayGapData[] = JSON.parse(response.data.body);
        setPayGapData(parsedData);
        const dates = [...new Set(parsedData.map(item => item.y_m))].sort();
        setAvailableDates(dates);
        setSelectedDate(dates[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchGeoJsonData = async () => {
      try {
        const response = await axios.get('https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/australia.geojson');
        setGeoJsonData(response.data);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
      }
    };

    fetchData();
    fetchGeoJsonData();
  }, []);

  const getFillColor = useCallback((stateIso: string) => {
    const stateData = payGapData.find(data => data.state === stateIso && data.y_m === selectedDate);
    if (!stateData) return '#888888';
    const payGap = ((stateData.males - stateData.females) / stateData.males * 100);
    if (payGap < 10) return '#4daf4a';
    if (payGap < 15) return '#ff7f00';
    return '#e41a1c';
  }, [payGapData, selectedDate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="range"
          min="0"
          max={availableDates.length - 1}
          value={availableDates.indexOf(selectedDate)}
          onChange={(e) => setSelectedDate(availableDates[parseInt(e.target.value, 10)])}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>2019</span>
          <span>2020</span>
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        Selected Date: {selectedDate}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {geoJsonData && (
          <Map
            {...viewport}
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v10"
            onMove={(evt) => setViewport(evt.viewState)}
            mapboxAccessToken={mapboxToken}
            onMouseMove={(evt) => {
              const state = evt.features && evt.features[0];
              const stateIso = state?.properties?.iso_3166_2;
              setHoveredState(stateIso ? stateNameMapping[stateIso] : null);
            }}
            interactiveLayerIds={['state-boundaries', 'state-borders']}
          >
            <Source id="australia-states" type="geojson" data={geoJsonData}>
              <Layer
                id="state-boundaries"
                type="fill"
                paint={{
                  'fill-color': [
                    'match',
                    ['get', 'iso_3166_2'],
                    ...Object.keys(stateNameMapping).flatMap(iso => [iso, getFillColor(iso)]),
                    '#888888'
                  ],
                  'fill-opacity': 0.6,
                }}
              />
              <Layer
                id="state-borders"
                type="line"
                paint={{
                  'line-color': '#ffffff',
                  'line-width': 1,
                }}
              />
            </Source>
            {hoveredState && (
              <div style={{
                position: 'absolute',
                margin: '8px',
                padding: '4px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                maxWidth: '300px',
                fontSize: '12px',
                zIndex: 9,
                pointerEvents: 'none',
              }}>
                <div>{hoveredState}</div>
                {(() => {
                  const stateIso = Object.keys(stateNameMapping).find(key => stateNameMapping[key] === hoveredState);
                  const stateData = payGapData.find(data => data.state === stateIso && data.y_m === selectedDate);
                  if (stateData) {
                    const payGap = ((stateData.males - stateData.females) / stateData.males * 100).toFixed(2);
                    return (
                      <>
                        <div>Time: {stateData.y_m}</div>
                        <div>Pay Gap: {payGap}%</div>
                        <div>Difference: ${stateData.difference}</div>
                      </>
                    );
                  }
                  return <div>No data available</div>;
                })()}
              </div>
            )}
          </Map>
        )}
      </div>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#4daf4a', marginRight: '5px' }}></div>
          <span>Pay Gap &lt; 10%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#ff7f00', marginRight: '5px' }}></div>
          <span>10% ≤ Pay Gap &lt; 15%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#e41a1c', marginRight: '5px' }}></div>
          <span>Pay Gap ≥ 15%</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;