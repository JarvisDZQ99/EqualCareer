import React, { useState, useCallback, useRef } from 'react';
import Map, { MapRef, Source, Layer, ViewState, MapMouseEvent } from 'react-map-gl';
import { LngLatBounds } from 'mapbox-gl';
import type { Feature, Geometry, Position } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent: React.FC = () => {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: -25.2744,
    longitude: 133.7751,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const mapRef = useRef<MapRef>(null);

  const mapboxToken = 'pk.eyJ1IjoieHlhbjAxNDUiLCJhIjoiY20wM3gwaG82MDJldjJxcHZ6bHExbWlqZSJ9.jLPRzC1D5LocMzCjCXFATw';

  const onMapClick = useCallback((event: MapMouseEvent) => {
    if (!event.features || event.features.length === 0) return;

    const clickedState = event.features[0] as Feature<Geometry>;
    console.log("Clicked state:", clickedState);

    if (clickedState.geometry) {
      const bounds = new LngLatBounds();

      if (clickedState.geometry.type === 'Polygon') {
        clickedState.geometry.coordinates[0].forEach((coord: Position) => {
          bounds.extend(coord as [number, number]);
        });
      } else if (clickedState.geometry.type === 'MultiPolygon') {
        clickedState.geometry.coordinates.forEach((polygon: Position[][]) => {
          polygon[0].forEach((coord: Position) => {
            bounds.extend(coord as [number, number]);
          });
        });
      }

      mapRef.current?.fitBounds(bounds, {
        padding: 50,
        duration: 1000, 
      });
    }
  }, []);

  return (
    <Map
      {...viewport}
      ref={mapRef}
      style={{ width: "100%", height: "600px" }}
      mapStyle="mapbox://styles/mapbox/light-v10"
      onMove={(evt) => setViewport(evt.viewState)}
      mapboxAccessToken={mapboxToken}
      onClick={onMapClick}
      interactiveLayerIds={['state-boundaries', 'state-borders', 'state-fills']}
    >
      <Source
        id="australia-states"
        type="geojson"
        data="https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/australia.geojson"
      >
        <Layer
          id="state-boundaries"
          type="fill"
          paint={{
            'fill-color': '#888888',
            'fill-opacity': 0.4,
          }}
        />
        <Layer
          id="state-borders"
          type="line"
          paint={{
            'line-color': '#000000',
            'line-width': 2,
          }}
        />
        <Layer
          id="state-fills"
          type="fill"
          paint={{
            'fill-color': 'transparent',
            'fill-opacity': 0.7,
          }}
        />
      </Source>
    </Map>
  );
};

export default MapComponent;