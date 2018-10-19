
import Decimal from "decimal.js/decimal";

const Area = (p0, p1, p2) => {
  var area = 0.0;
  area = parseFloat(p0.longitude) * parseFloat(p1.latitude) +
    parseFloat(p1.longitude) * parseFloat(p2.latitude) +
    parseFloat(p2.longitude) * parseFloat(p0.latitude) -
    parseFloat(p1.longitude) * parseFloat(p0.latitude) -
    parseFloat(p2.longitude) * parseFloat(p1.latitude) -
    parseFloat(p0.longitude) * parseFloat(p2.latitude);
  return area / 2;
}

//amap 计算polygon的质心
export const getPolygonAreaCenter = (points) => {
  var sum_x = 0;
  var sum_y = 0;
  var sum_area = 0;
  var p1 = points[1];
  for (var i = 2; i < points.length; i++) {
    var p2 = points[i];
    var area = Area(points[0], p1, p2);
    sum_area += area;
    sum_x += (parseFloat(points[0].longitude) + parseFloat(p1.longitude) + parseFloat(p2.longitude)) * area;
    sum_y += (parseFloat(points[0].latitude) + parseFloat(p1.latitude) + parseFloat(p2.latitude)) * area;
    p1 = p2;
  }
  var xx = sum_x / sum_area / 3;
  var yy = sum_y / sum_area / 3;
  return {
    longitude: xx,
    latitude: yy
  };
}
