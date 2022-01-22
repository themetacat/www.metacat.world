import L from 'leaflet';

function textPixelLength(text, psize) {
  let c = document.querySelector('canvas');
  if (!c) {
    c = document.createElement('canvas');
  }
  const ctx = c.getContext('2d');

  ctx.font = `${psize}px Arial`;
  return ctx.measureText(text).width;
}

function getTextCanvas(text) {
  const fontSize = 12;
  const cdiv = textPixelLength(text, fontSize);

  const width = cdiv * 1.3;
  const height = 28;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(100,200,0, 0.7)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${fontSize}px bold`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return canvas;
}

function AddLabelToGeoJSON(geojson, map, option = {}) {
  const options = {
    LabelMaxFontSize: 38,
    LabelMinFontSize: 8,
    LabelStyleClass: null,
    LabelMaxLength: 10,
    LabelFeatureProperty: null,
  };

  Object.keys(option).forEach((key) => {
    options[key] = option[key];
  });

  if (!options.LabelFeatureProperty) throw new Error('LabelFeatureProperty not provided');

  const geoJSONLayer = L.geoJson(geojson);
  const finalZoomLevel = map.getBoundsZoom(geoJSONLayer.getBounds());

  function zoomFontSizeFactor(zoomFrom, zoomTo) {
    const zoomDiff = zoomFrom - zoomTo;
    if (zoomTo > zoomFrom || zoomDiff < 0.1) return zoomFrom;
    if (zoomDiff <= 0.5) return zoomFrom * Math.PI * 0.35;
    if (zoomDiff <= 1.1) return zoomFrom * Math.PI * 0.41;
    if (zoomDiff <= 1.5) return zoomFrom * Math.PI * 0.47;
    if (zoomDiff <= 2.1) return zoomFrom * Math.PI * 0.53;
    if (zoomDiff <= 2.4) return zoomFrom * Math.PI * 0.6;
    if (zoomDiff <= 2.8) return zoomFrom * Math.PI * 0.66;
    if (zoomDiff <= 3.1) return zoomFrom * Math.PI * 0.72;
    if (zoomDiff <= 3.4) return zoomFrom * Math.PI * 0.78;
    if (zoomDiff <= 3.8) return zoomFrom * Math.PI * 0.84;
    if (zoomDiff <= 4.1) return zoomFrom * Math.PI * 0.9;
    if (zoomDiff <= 4.5) return zoomFrom * Math.PI * 0.96;
    return zoomFrom * Math.PI;
    // else if(zoomDiff<=5.5) return zoom*Math.PI*0.8;
    // else if(zoomDiff<=6.1) return zoom*Math.PI*0.85;
    // else if(zoomDiff<=6.5) return zoom*Math.PI*0.9;
    // else if(zoomDiff<=7.1) return zoom*Math.PI*0.95;
    // else if(zoomDiff<=7.5) return zoom*Math.PI*1.2;
    // else return zoom*Math.PI*1.5;
  }

  L.geoJson(geojson, {
    onEachFeature: (f, l) => {
      const label = f.properties[options.LabelFeatureProperty];
      if (!label) {
        return;
      }
      const sw = l.getBounds().getSouthWest();
      const se = l.getBounds().getSouthEast();
      const c = l.getBounds().getCenter();
      const nw = l.getBounds().getNorthWest();
      const ne = l.getBounds().getNorthEast();

      const yDiff = Math.abs(sw.lat - nw.lat);
      const xDiff = Math.abs(sw.lng - se.lng);

      const zoom = map.getBoundsZoom(l.getBounds()); // ----
      const fontsize =
        (options.LabelMaxFontSize * finalZoomLevel) / zoomFontSizeFactor(zoom, finalZoomLevel); // --- calculating approx. font size for finalZoomLevel

      // if (label.length > options.LabelMaxLength)
      // label = label.substr(0, options.LabelMaxLength) + "..";

      const markerposition = c;

      // aligning label text to center

      if (fontsize >= options.LabelMinFontSize) {
        const canvas = getTextCanvas(label);
        if (xDiff > yDiff) {
          L.marker(markerposition, {
            icon: L.icon({
              iconUrl: canvas.toDataURL('image/png'),
              iconSize: [canvas.width, canvas.height],
            }),
          }).addTo(map);
        } else {
          L.marker(markerposition, {
            icon: L.icon({
              iconUrl: canvas.toDataURL('image/png'),
              iconSize: [canvas.width, canvas.height],
            }),
          }).addTo(map);
        }
      }
    },
  });
}

export default AddLabelToGeoJSON;
