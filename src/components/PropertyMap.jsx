import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icons broken by webpack/vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Navy pin for the main property
const navyIcon = new L.DivIcon({
  html: `<div style="
    width:32px;height:32px;border-radius:50% 50% 50% 0;
    background:#1A1A2E;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.25);
    transform:rotate(-45deg);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  className: '',
})

// Small dot for nearby places
const nearbyIcon = new L.DivIcon({
  html: `<div style="
    width:10px;height:10px;border-radius:50%;
    background:#E8E3DB;border:2px solid #888480;
    box-shadow:0 1px 4px rgba(0,0,0,0.2);
  "></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  className: '',
})

function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], 14) }, [lat, lng, map])
  return null
}

export default function PropertyMap({ project }) {
  const lat = project?.location?.latitude
  const lng = project?.location?.longitude

  if (!lat || !lng) return null

  const mapPoints = project.project_map_points || []

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8E3DB]" style={{ height: 340 }}>
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url={`https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_KEY}`}
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <RecenterMap lat={lat} lng={lng} />

        {/* Main property pin */}
        <Marker position={[lat, lng]} icon={navyIcon}>
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 140 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: '#0D0D0D', margin: '0 0 2px' }}>{project.name}</p>
              <p style={{ fontSize: 11, color: '#888480', margin: 0 }}>
                {project.location?.district || project.location?.sector}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby place labels — positioned approximately using bearing from property */}
        {mapPoints.slice(0, 6).map((pt, i) => {
          // Distribute nearby pins around the property using rough bearing offsets
          const angle = (i * 60) * (Math.PI / 180)
          const kmPerDeg = 111
          const dist = (pt.distance || 1) * 0.6 // scale down so they appear near
          const nearLat = lat + (dist / kmPerDeg) * Math.cos(angle)
          const nearLng = lng + (dist / (kmPerDeg * Math.cos(lat * Math.PI / 180))) * Math.sin(angle)
          return (
            <Marker key={i} position={[nearLat, nearLng]} icon={nearbyIcon}>
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif' }}>
                  <p style={{ fontWeight: 600, fontSize: 12, color: '#0D0D0D', margin: '0 0 2px' }}>{pt.map_point_name}</p>
                  <p style={{ fontSize: 11, color: '#888480', margin: 0 }}>
                    {pt.distance} km · {Math.round(pt.time)} min
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
