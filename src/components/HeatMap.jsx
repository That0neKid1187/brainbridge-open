// src/components/HeatMap.jsx
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import supabase from '../supabaseClient';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Approximate zones for each state
const REGION_ZONES = {
    AL: {
      rural: [{ x: -87.0, y: 32.5 }],
      suburban: [{ x: -86.7, y: 33.5 }],
      urban: [{ x: -86.8, y: 33.5 }],
    },
    AK: {
      rural: [{ x: -149.5, y: 64.8 }],
      suburban: [{ x: -149.0, y: 61.2 }],
      urban: [{ x: -149.9, y: 61.2 }],
    },
    AZ: {
      rural: [{ x: -111.5, y: 34.5 }],
      suburban: [{ x: -112.1, y: 33.6 }],
      urban: [{ x: -112.07, y: 33.45 }],
    },
    AR: {
      rural: [{ x: -92.4, y: 34.6 }],
      suburban: [{ x: -92.2, y: 34.8 }],
      urban: [{ x: -92.3, y: 34.75 }],
    },
    CA: {
      rural: [{ x: -121.5, y: 38.5 }],
      suburban: [{ x: -118.5, y: 34.1 }],
      urban: [{ x: -118.25, y: 34.05 }],
    },
    CO: {
      rural: [{ x: -106.0, y: 39.0 }],
      suburban: [{ x: -104.9, y: 39.7 }],
      urban: [{ x: -104.99, y: 39.74 }],
    },
    CT: {
      rural: [{ x: -72.8, y: 41.6 }],
      suburban: [{ x: -72.6, y: 41.7 }],
      urban: [{ x: -72.68, y: 41.77 }],
    },
    DE: {
      rural: [{ x: -75.5, y: 38.9 }],
      suburban: [{ x: -75.4, y: 39.7 }],
      urban: [{ x: -75.5, y: 39.74 }],
    },
    FL: {
      rural: [{ x: -82.3, y: 29.2 }],
      suburban: [{ x: -80.3, y: 26.1 }],
      urban: [{ x: -80.2, y: 25.76 }],
    },
    GA: {
      rural: [{ x: -83.6, y: 32.5 }],
      suburban: [{ x: -84.3, y: 33.6 }],
      urban: [{ x: -84.39, y: 33.75 }],
    },
    HI: {
      rural: [{ x: -155.3, y: 20.6 }],
      suburban: [{ x: -157.9, y: 21.3 }],
      urban: [{ x: -157.85, y: 21.31 }],
    },
    ID: {
      rural: [{ x: -114.5, y: 43.7 }],
      suburban: [{ x: -116.3, y: 43.6 }],
      urban: [{ x: -116.2, y: 43.62 }],
    },
    IL: {
      rural: [{ x: -89.3, y: 39.0 }],
      suburban: [{ x: -88.2, y: 41.8 }],
      urban: [{ x: -87.63, y: 41.88 }],
    },
    IN: {
      rural: [{ x: -87.5, y: 40.2 }, { x: -86.0, y: 39.5 }],
      suburban: [{ x: -86.1, y: 39.9 }, { x: -85.8, y: 40.0 }],
      urban: [{ x: -86.15, y: 39.77 }],
    },
    IA: {
      rural: [{ x: -93.5, y: 42.1 }],
      suburban: [{ x: -93.6, y: 41.6 }],
      urban: [{ x: -93.62, y: 41.6 }],
    },
    KS: {
      rural: [{ x: -98.3, y: 38.5 }],
      suburban: [{ x: -97.3, y: 37.7 }],
      urban: [{ x: -97.33, y: 37.68 }],
    },
    KY: {
      rural: [{ x: -84.5, y: 37.5 }],
      suburban: [{ x: -85.6, y: 38.2 }],
      urban: [{ x: -85.75, y: 38.25 }],
    },
    LA: {
      rural: [{ x: -92.1, y: 31.5 }],
      suburban: [{ x: -90.2, y: 30.0 }],
      urban: [{ x: -90.07, y: 29.95 }],
    },
    MA: {
      rural: [{ x: -72.2, y: 42.4 }],
      suburban: [{ x: -71.2, y: 42.3 }],
      urban: [{ x: -71.06, y: 42.36 }],
    },
    MD: {
      rural: [{ x: -76.8, y: 39.5 }],
      suburban: [{ x: -76.7, y: 39.2 }],
      urban: [{ x: -76.6, y: 39.3 }],
    },
    ME: {
      rural: [{ x: -69.8, y: 45.2 }],
      suburban: [{ x: -70.2, y: 43.7 }],
      urban: [{ x: -70.26, y: 43.65 }],
    },
    MI: {
      rural: [{ x: -84.8, y: 44.3 }],
      suburban: [{ x: -83.3, y: 42.6 }],
      urban: [{ x: -83.05, y: 42.33 }],
    },
    MN: {
      rural: [{ x: -94.5, y: 46.5 }],
      suburban: [{ x: -93.3, y: 45.1 }],
      urban: [{ x: -93.26, y: 44.98 }],
    },
    MO: {
      rural: [{ x: -92.7, y: 38.0 }],
      suburban: [{ x: -90.5, y: 38.5 }],
      urban: [{ x: -90.2, y: 38.6 }],
    },
    MS: {
      rural: [{ x: -89.7, y: 32.8 }],
      suburban: [{ x: -90.2, y: 32.3 }],
      urban: [{ x: -90.18, y: 32.3 }],
    },
    MT: {
      rural: [{ x: -110.0, y: 47.0 }],
      suburban: [{ x: -111.0, y: 46.6 }],
      urban: [{ x: -111.04, y: 46.59 }],
    },
    NC: {
      rural: [{ x: -79.0, y: 35.5 }],
      suburban: [{ x: -80.8, y: 35.2 }],
      urban: [{ x: -80.84, y: 35.23 }],
    },
    ND: {
      rural: [{ x: -100.0, y: 47.3 }],
      suburban: [{ x: -97.1, y: 46.9 }],
      urban: [{ x: -96.8, y: 46.87 }],
    },
    NE: {
      rural: [{ x: -100.0, y: 41.5 }],
      suburban: [{ x: -96.1, y: 40.9 }],
      urban: [{ x: -96.0, y: 41.26 }],
    },
    NH: {
      rural: [{ x: -71.6, y: 44.1 }],
      suburban: [{ x: -71.3, y: 43.2 }],
      urban: [{ x: -71.46, y: 43.21 }],
    },
    NJ: {
      rural: [{ x: -74.9, y: 40.4 }],
      suburban: [{ x: -74.2, y: 40.7 }],
      urban: [{ x: -74.17, y: 40.74 }],
    },
    NM: {
      rural: [{ x: -106.1, y: 34.9 }],
      suburban: [{ x: -106.7, y: 35.0 }],
      urban: [{ x: -106.65, y: 35.08 }],
    },
    NV: {
      rural: [{ x: -116.9, y: 38.5 }],
      suburban: [{ x: -115.2, y: 36.2 }],
      urban: [{ x: -115.14, y: 36.17 }],
    },
    NY: {
      rural: [{ x: -75.5, y: 43.5 }, { x: -76.3, y: 42.9 }],
      suburban: [{ x: -74.2, y: 41.0 }, { x: -73.7, y: 41.2 }],
      urban: [{ x: -73.95, y: 40.7 }]
    },
    OH: {
      rural: [{ x: -82.8, y: 40.3 }],
      suburban: [{ x: -81.7, y: 41.3 }],
      urban: [{ x: -81.69, y: 41.5 }],
    },
    OK: {
      rural: [{ x: -97.2, y: 35.3 }],
      suburban: [{ x: -97.5, y: 35.6 }],
      urban: [{ x: -97.52, y: 35.47 }],
    },
    OR: {
      rural: [{ x: -120.5, y: 43.5 }],
      suburban: [{ x: -122.8, y: 45.3 }],
      urban: [{ x: -122.67, y: 45.52 }],
    },
    PA: {
      rural: [{ x: -78.5, y: 41.0 }],
      suburban: [{ x: -75.3, y: 40.0 }],
      urban: [{ x: -75.17, y: 39.95 }],
    },
    RI: {
      rural: [{ x: -71.6, y: 41.5 }],
      suburban: [{ x: -71.4, y: 41.8 }],
      urban: [{ x: -71.41, y: 41.82 }],
    },
    SC: {
      rural: [{ x: -81.0, y: 34.0 }],
      suburban: [{ x: -80.0, y: 33.8 }],
      urban: [{ x: -80.03, y: 32.77 }],
    },
    SD: {
      rural: [{ x: -100.0, y: 44.0 }],
      suburban: [{ x: -96.8, y: 43.6 }],
      urban: [{ x: -96.73, y: 43.55 }],
    },
    TN: {
      rural: [{ x: -86.6, y: 35.9 }],
      suburban: [{ x: -86.7, y: 36.1 }],
      urban: [{ x: -86.78, y: 36.16 }],
    },
    TX: {
      rural: [{ x: -99.9, y: 31.0 }],
      suburban: [{ x: -96.8, y: 32.8 }],
      urban: [{ x: -95.36, y: 29.76 }],
    },
    UT: {
      rural: [{ x: -112.0, y: 39.3 }],
      suburban: [{ x: -111.9, y: 40.7 }],
      urban: [{ x: -111.89, y: 40.76 }],
    },
    VT: {
      rural: [{ x: -72.7, y: 44.3 }],
      suburban: [{ x: -72.5, y: 44.3 }],
      urban: [{ x: -73.2, y: 44.48 }],
    },
    VA: {
      rural: [{ x: -79.5, y: 37.5 }],
      suburban: [{ x: -77.3, y: 38.7 }],
      urban: [{ x: -77.2, y: 38.9 }],
    },
    WA: {
      rural: [{ x: -120.5, y: 47.5 }],
      suburban: [{ x: -122.2, y: 47.5 }],
      urban: [{ x: -122.33, y: 47.6 }],
    },
    WI: {
      rural: [{ x: -89.5, y: 44.5 }],
      suburban: [{ x: -88.0, y: 43.0 }],
      urban: [{ x: -87.9, y: 43.04 }],
    },
    WV: {
      rural: [{ x: -80.0, y: 38.8 }],
      suburban: [{ x: -81.6, y: 38.3 }],
      urban: [{ x: -81.63, y: 38.35 }],
    },
    WY: {
      rural: [{ x: -107.5, y: 43.0 }],
      suburban: [{ x: -106.3, y: 42.8 }],
      urban: [{ x: -106.31, y: 42.85 }],
    }
  };  

  const DEFAULT_RURAL_LOCATIONS = [
    { x: -100.5, y: 38.5 },
    { x: -97.0, y: 35.5 },
    { x: -89.0, y: 37.2 },
    { x: -92.0, y: 33.0 },
  ];
  
  function getRandomCoord(coords) {
    const index = Math.floor(Math.random() * coords.length);
    const jitterX = (Math.random() - 0.5) * 0.5;
    const jitterY = (Math.random() - 0.5) * 0.5;
    return [coords[index].x + jitterX, coords[index].y + jitterY];
  }
  
  export default function HeatMap() {
    const [users, setUsers] = useState([]);
    const [tooltipContent, setTooltipContent] = useState("");
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, show: false });
  
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('state_code, classification');
      if (!error && data) {
        const cleaned = data.map((u) => ({
          state_code: u.state_code?.toUpperCase(),
          classification: u.classification?.toLowerCase(),
        }));
        setUsers(cleaned);
      } else {
        console.error('Error fetching user data:', error?.message);
      }
    };
  
    useEffect(() => {
      fetchUsers();
      const subscription = supabase
        .channel('any')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          fetchUsers();
        })
        .subscribe();
  
      return () => {
        supabase.removeChannel(subscription);
      };
    }, []);
  
    return (
<div className="w-full min-h-[400px]">
  <ComposableMap projection="geoAlbersUsa" width={980} height={551}>
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#EEE"
            stroke="#FFF"
            style={{
              default: { outline: "none" },
              hover: { outline: "none", opacity: 0.8 },
              pressed: { outline: "none" },
            }}
          />
        ))
      }
    </Geographies>

    {users.map((user, i) => {
      const { state_code, classification } = user;
      const zones = REGION_ZONES[state_code]?.[classification];
      const coords = zones || DEFAULT_RURAL_LOCATIONS;
      const [x, y] = getRandomCoord(coords);
      return (
        <Marker
          key={i}
          coordinates={[x, y]}
          onMouseEnter={(e) => {
            setTooltipContent(`${classification} user in ${state_code}`);
            setTooltipPos({ x: e.clientX, y: e.clientY, show: true });
          }}
          onMouseLeave={() => setTooltipPos({ ...tooltipPos, show: false })}
        >
          <circle
            r={3}
            fill={
              classification === 'rural' ? '#4CAF50' :
              classification === 'urban' ? '#F44336' :
              '#2196F3'
            }
            stroke="#fff"
            strokeWidth={0.5}
          />
        </Marker>
      );
    })}
  </ComposableMap>

  {tooltipPos.show && (
    <div
      className="absolute bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-white px-3 py-1 rounded shadow"
      style={{ top: tooltipPos.y + 10, left: tooltipPos.x + 10, pointerEvents: 'none' }}
    >
      {tooltipContent}
    </div>
  )}
</div>
    
    );
  }
  