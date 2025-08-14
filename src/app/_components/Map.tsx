import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface NGO {
  name: string;
  services: string;
  contact: string;
  rating: number;
  location: [number, number];
}

interface MapContainerProps {
  data: NGO[] | string;
}

const MapContainer: React.FC<MapContainerProps> = ({ data }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: [
                'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                'https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                'https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
              ],
              tileSize: 256,
              attribution: '© Google Maps'
            }
          },
          layers: [{
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 20
          }]
        },
        center: [78.9629, 20.5937],
        zoom: 4
      });

      map.current.addControl(new maplibregl.NavigationControl());

      map.current.on('load', () => {
        if (Array.isArray(data) && data.length > 0) {
          const bounds = new maplibregl.LngLatBounds();

          data.forEach(ngo => {
            const popup = new maplibregl.Popup({ 
              offset: 25,
              closeButton: false,
              maxWidth: '300px'
            })
            .setHTML(`
              <div class="p-4 rounded-lg shadow-sm">
                <h3 class="font-bold text-lg mb-2">${ngo.name}</h3>
                <p class="text-gray-600 mb-1">${ngo.services}</p>
                <p class="text-gray-600 mb-1">Contact: ${ngo.contact}</p>
                <p class="text-amber-500">${'⭐'.repeat(Math.round(ngo.rating))}</p>
              </div>
            `);

            new maplibregl.Marker({
              color: '#dc2626', 
              scale: 1.2
            })
            .setLngLat([ngo.location[1], ngo.location[0]])
            .setPopup(popup)
            .addTo(map.current!);

            bounds.extend([ngo.location[1], ngo.location[0]]);
          });
          
          if (map.current) {
            map.current.fitBounds(bounds, {
              padding: { top: 50, bottom: 50, left: 50, right: 50 },
              maxZoom: 15,
              duration: 1000
            });
          }
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [data]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[600px] mt-4 rounded-lg shadow-lg"
    />
  );
};

export default MapContainer;