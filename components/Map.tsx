import {
  Coords,
  GeolocationResponse,
  LocalAntenna,
  WifiAntenna,
} from '@/app/types/definitions'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'

// Colores para las 3 antenas de la API
const API_COLORS = ['#10b981', '#f59e0b', '#ef4444']
const API_LABELS = ['Más cercana', '2ª más cercana', '3ª más cercana']

// Color para las antenas locales del JSON
const LOCAL_COLOR = '#6366f1'

const MAP_TILER_KEY = process.env.EXPO_PUBLIC_MAP_TILER_KEY

const MAPS = {
  calles: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAP_TILER_KEY}`,
  satelite: `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${MAP_TILER_KEY}`,
  hibrido: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAP_TILER_KEY}`,
} as const

type MapStyleKey = keyof typeof MAPS

// ── HTML con Leaflet embebido ──
function buildMapHtml(initialTileUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body,#map{width:100%;height:100%;overflow:hidden}
.user-dot{width:16px;height:16px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(59,130,246,.6)}
.user-pulse{width:40px;height:40px;border-radius:50%;background:rgba(59,130,246,.18);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:pulse 2s infinite}
@keyframes pulse{0%{transform:translate(-50%,-50%) scale(.5);opacity:1}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
.user-wrapper{position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center}
.api-marker{width:32px;height:32px;border-radius:50%;border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,.35)}
.local-marker{width:24px;height:24px;border-radius:50%;background:${LOCAL_COLOR};border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.dist-label{padding:2px 7px;border-radius:8px;color:#fff;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.leaflet-control-attribution{display:none!important}
</style>
</head>
<body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false}).setView([-38.5,-63.5],4);
var tileLayer=L.tileLayer('${initialTileUrl}',{maxZoom:19}).addTo(map);
var dataLayer=L.layerGroup().addTo(map);

function setTile(url){tileLayer.setUrl(url)}

function flyTo(lat,lng,zoom){
  map.flyTo([lat,lng],zoom||15,{duration:2.5});
}

function clearData(){dataLayer.clearLayers()}

function addUserMarker(lat,lng){
  var icon=L.divIcon({
    className:'',
    html:'<div class="user-wrapper"><div class="user-pulse"></div><div class="user-dot"></div></div>',
    iconSize:[40,40],
    iconAnchor:[20,20]
  });
  L.marker([lat,lng],{icon:icon,zIndexOffset:100}).addTo(dataLayer);
}

function addLocalMarker(lat,lng,name,desc){
  var icon=L.divIcon({
    className:'',
    html:'<div class="local-marker">📡</div>',
    iconSize:[24,24],
    iconAnchor:[12,12]
  });
  var m=L.marker([lat,lng],{icon:icon,zIndexOffset:5}).addTo(dataLayer);
  if(name)m.bindPopup('<b>'+name+'</b>'+(desc?'<br>'+desc:''));
}

function addApiMarker(lat,lng,color,title,desc){
  var icon=L.divIcon({
    className:'',
    html:'<div class="api-marker" style="background:'+color+'">📶</div>',
    iconSize:[32,32],
    iconAnchor:[16,16]
  });
  var m=L.marker([lat,lng],{icon:icon,zIndexOffset:10}).addTo(dataLayer);
  if(title)m.bindPopup('<b>'+title+'</b>'+(desc?'<br>'+desc:''));
}

function addPolyline(lat1,lng1,lat2,lng2,color){
  L.polyline([[lat1,lng1],[lat2,lng2]],{color:color,weight:2,dashArray:'8 4'}).addTo(dataLayer);
}

function addDistanceLabel(lat,lng,text,color){
  var icon=L.divIcon({
    className:'',
    html:'<div class="dist-label" style="background:'+color+'">'+text+'</div>',
    iconSize:[60,20],
    iconAnchor:[30,10]
  });
  L.marker([lat,lng],{icon:icon,zIndexOffset:20,interactive:false}).addTo(dataLayer);
}

function handleUpdate(data){
  clearData();
  if(data.userCoords){
    addUserMarker(data.userCoords.latitude,data.userCoords.longitude);
  }
  if(data.localAntennas){
    data.localAntennas.forEach(function(a){
      var desc=[
        a.location?'\\u{1F4CD} '+a.location:'',
        '\\u{1F4E1} '+a.type,
        '\\u{1F465} '+a.users+' usuarios',
        a.MAC?'\\u{1F517} MAC: '+a.MAC:''
      ].filter(Boolean).join('<br>');
      addLocalMarker(a.lat,a.lon,a.name,desc);
    });
  }
  if(data.apiAntennas){
    var colors=${JSON.stringify(API_COLORS)};
    var labels=${JSON.stringify(API_LABELS)};
    data.apiAntennas.forEach(function(a,i){
      var desc=[
        '\\u{1F4CF} '+a.distance,
        '\\u{1F4E1} '+a.type,
        '\\u{1F465} '+a.users+' usuarios',
        a.MAC!=='No disponible'?'\\u{1F517} MAC: '+a.MAC:''
      ].filter(Boolean).join('<br>');
      addApiMarker(a.coords.lat,a.coords.lon,colors[i],labels[i]+' \\u2014 '+a.antenna,desc);
      if(data.userCoords){
        addPolyline(data.userCoords.latitude,data.userCoords.longitude,a.coords.lat,a.coords.lon,colors[i]);
        var midLat=(data.userCoords.latitude+a.coords.lat)/2;
        var midLng=(data.userCoords.longitude+a.coords.lon)/2;
        addDistanceLabel(midLat,midLng,a.distance,colors[i]);
      }
    });
  }
}

document.addEventListener('message',function(e){
  try{var d=JSON.parse(e.data);
    if(d.type==='setTile')setTile(d.url);
    else if(d.type==='flyTo')flyTo(d.lat,d.lng,d.zoom);
    else if(d.type==='update')handleUpdate(d.payload);
  }catch(err){}
});
window.addEventListener('message',function(e){
  try{var d=JSON.parse(e.data);
    if(d.type==='setTile')setTile(d.url);
    else if(d.type==='flyTo')flyTo(d.lat,d.lng,d.zoom);
    else if(d.type==='update')handleUpdate(d.payload);
  }catch(err){}
});
<\/script>
</body>
</html>`
}

interface MapProps {
  userCoords?: Coords
  wifiData?: GeolocationResponse
  localAntennas?: LocalAntenna[]
}

export default function Map({
  userCoords,
  wifiData,
  localAntennas = [],
}: MapProps) {
  const webViewRef = useRef<WebView>(null)
  const hasFlown = useRef(false)
  const webViewReady = useRef(false)
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('calles')

  const apiAntennas = useMemo(
    () =>
      [
        wifiData?.closest_wifi,
        wifiData?.second_closest_wifi,
        wifiData?.third_closest_wifi,
      ].filter(Boolean) as WifiAntenna[],
    [wifiData],
  )

  const filteredLocal = useMemo(() => {
    if (apiAntennas.length === 0) return localAntennas
    const apiCoords = new Set(
      apiAntennas.map(
        (a) => `${a.coords.lat.toFixed(5)},${a.coords.lon.toFixed(5)}`,
      ),
    )
    return localAntennas.filter(
      (a) => !apiCoords.has(`${a.lat.toFixed(5)},${a.lon.toFixed(5)}`),
    )
  }, [localAntennas, apiAntennas])

  // ── Inyectar JS en el WebView ──
  const inject = (js: string) => {
    webViewRef.current?.injectJavaScript(js + ';true;')
  }

  // ── Enviar datos cuando cambian ──
  useEffect(() => {
    if (!webViewReady.current) return
    const payload = JSON.stringify({
      userCoords,
      apiAntennas,
      localAntennas: filteredLocal,
    })
    inject(`handleUpdate(${payload})`)
  }, [userCoords, apiAntennas, filteredLocal])

  // ── Efecto vuelo ──
  useEffect(() => {
    if (!userCoords || hasFlown.current || !webViewReady.current) return
    hasFlown.current = true
    const timer = setTimeout(() => {
      inject(
        `flyTo(${userCoords.latitude},${userCoords.longitude},15)`,
      )
    }, 600)
    return () => clearTimeout(timer)
  }, [userCoords])

  // ── Cambio de estilo de mapa ──
  useEffect(() => {
    if (!webViewReady.current) return
    inject(`setTile('${MAPS[mapStyle]}')`)
  }, [mapStyle])

  const handleWebViewLoad = () => {
    webViewReady.current = true

    // Enviar datos iniciales
    const payload = JSON.stringify({
      userCoords,
      apiAntennas,
      localAntennas: filteredLocal,
    })
    inject(`handleUpdate(${payload})`)

    // Vuelo inicial
    if (userCoords && !hasFlown.current) {
      hasFlown.current = true
      setTimeout(() => {
        inject(
          `flyTo(${userCoords.latitude},${userCoords.longitude},15)`,
        )
      }, 600)
    }
  }

  const htmlSource = useMemo(() => buildMapHtml(MAPS.calles), [])

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlSource }}
        style={styles.map}
        onLoadEnd={handleWebViewLoad}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        cacheEnabled
        mixedContentMode="compatibility"
        androidLayerType="hardware"
      />

      {/* Selector de estilo */}
      <View style={styles.mapSwitcher}>
        {(['calles', 'satelite', 'hibrido'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setMapStyle(k)}
            style={[
              styles.switchBtn,
              mapStyle === k && styles.switchBtnActive,
            ]}
          >
            <Text
              style={[
                styles.switchText,
                mapStyle === k && styles.switchTextActive,
              ]}
            >
              {k}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Leyenda flotante */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: LOCAL_COLOR }]} />
          <Text style={styles.legendText}>
            Antenas zona ({filteredLocal.length})
          </Text>
        </View>
        {API_LABELS.map((label, i) => (
          <View key={i} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: API_COLORS[i] }]}
            />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  map: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a2e',
  },
  legend: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderRadius: 10,
    padding: 8,
    gap: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#555',
    fontWeight: '500',
  },
  mapSwitcher: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 8,
    zIndex: 30,
  },
  switchBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchBtnActive: {
    backgroundColor: '#111',
  },
  switchText: {
    fontSize: 12,
    color: '#111',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  switchTextActive: {
    color: '#fff',
  },
})
