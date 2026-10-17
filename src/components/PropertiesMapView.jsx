import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function fmtPrice(n) {
  if (!n) return null
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
  return `${Math.round(n / 1000)}K`
}

function makeIcon(price, active) {
  const label = price ? `AED ${fmtPrice(price)}` : '●'
  const bg    = active ? '#1A1A2E' : '#ffffff'
  const color = active ? '#ffffff' : '#1A1A2E'
  const border = active ? '#1A1A2E' : '#CCC7BF'
  return new L.DivIcon({
    html: `<div style="
      background:${bg};color:${color};border:1.5px solid ${border};
      border-radius:20px;padding:4px 9px;
      font-family:Inter,sans-serif;font-size:11px;font-weight:600;
      white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);
      cursor:pointer;transition:all .15s;
    ">${label}</div>`,
    iconAnchor: [0, 0],
    className: '',
  })
}

function FitBounds({ projects }) {
  const map = useMap()
  if (projects.length === 0) return null
  const latlngs = projects
    .filter(p => p.location?.latitude)
    .map(p => [p.location.latitude, p.location.longitude])
  if (latlngs.length > 0) {
    try { map.fitBounds(latlngs, { padding: [40, 40], maxZoom: 13 }) } catch (_) {}
  }
  return null
}

export default function PropertiesMapView({ projects }) {
  const [activeId, setActiveId] = useState(null)
  const withCoords = projects.filter(p => p.location?.latitude && p.location?.longitude)

  const center = withCoords.length > 0
    ? [
        withCoords.reduce((s, p) => s + p.location.latitude, 0) / withCoords.length,
        withCoords.reduce((s, p) => s + p.location.longitude, 0) / withCoords.length,
      ]
    : [25.2048, 55.2708]

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8E3DB] shadow-card" style={{ height: 560 }}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url={`https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_KEY}`}
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <FitBounds projects={withCoords} />

        {withCoords.map(p => (
          <Marker
            key={p.id}
            position={[p.location.latitude, p.location.longitude]}
            icon={makeIcon(p.min_price, activeId === p.id)}
            eventHandlers={{ click: () => setActiveId(p.id === activeId ? null : p.id) }}
          >
            <Popup>
              <Link
                to={`/properties/${p.id}`}
                style={{ textDecoration: 'none', display: 'block', minWidth: 180 }}
              >
                {p.cover_image?.url && (
                  <img
                    src={p.cover_image.url}
                    alt={p.name}
                    style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                  />
                )}
                <p style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 13, color: '#0D0D0D', margin: '0 0 2px' }}>
                  {p.name}
                </p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#888480', margin: '0 0 4px' }}>
                  {p.developer}
                </p>
                {p.min_price && (
                  <p style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 13, color: '#1A1A2E', margin: 0 }}>
                    AED {fmtPrice(p.min_price)}
                  </p>
                )}
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#1A1A2E', marginTop: 4, fontWeight: 600 }}>
                  View project →
                </p>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
