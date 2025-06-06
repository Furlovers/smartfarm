import L from "leaflet";
import iconPng      from "leaflet/dist/images/marker-icon.png";
import iconRetinaPng from "leaflet/dist/images/marker-icon-2x.png";
import shadowPng    from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl:       iconPng,
  iconRetinaUrl: iconRetinaPng,
  shadowUrl:     shadowPng,
});
