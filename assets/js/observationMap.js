
function observationMap(div) {

	this.div = div;
	this.setup();

	this.iconStyle = new ol.style.Style({
	  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	    anchor: [0.5, 35],
	    anchorXUnits: 'fraction',
	    anchorYUnits: 'pixels',
	    opacity: 1,
	    src: 'assets/imgs/pin_red.png'
	 }))
});

}
observationMap.prototype.setup = function() {

	this.data = new ol.source.Vector();
	this.pointLayer = new ol.layer.Vector({
		source: this.data
	}
	);	

	var raster = this.raster = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'http://api.tiles.mapbox.com/v4/pumped.j9l7pafh/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicHVtcGVkIiwiYSI6Ik5VTjlka2MifQ.0k-6s3mWkXrSYDcQrrLGDg'
      })
    });

	this.map = new ol.Map({
	  layers: [this.raster, this.pointLayer],
	  target: this.div,
	  view: new ol.View({
	    center: [0, 0],
	    zoom: 2
	  })
	});

}

observationMap.prototype._addPoint = function(x,y,obj) {
	var point = new ol.Feature({
		geometry:new ol.geom.Point(ol.proj.transform([y,x], 'EPSG:4326', 'EPSG:3857'))
	});

	point.setStyle(this.iconStyle);
	this.data.addFeature(point);
}

observationMap.prototype.setData = function(data) {

	var rawData = [];

	var cons = data.hits.hits;

	for (i in cons) {
		var observation = cons[i]["_source"];
		rawData.push(observation);
		if (typeof observation.location != "undefined") {
			this._addPoint(observation.location.lat,observation.location.lon,observation);
		}
	}

}

