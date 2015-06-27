
function heatMap(div) {
	this.div = div;
	this.setup();
}

heatMap.prototype.setup = function() {

	this.data = new ol.source.Vector();	

	var heatmapLayer = this.heatmapLayer = new ol.layer.Heatmap({
		source: this.data,
	  blur: 20,
	  radius: 10
	});

	var raster = this.raster = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'http://api.tiles.mapbox.com/v4/pumped.j9l7pafh/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicHVtcGVkIiwiYSI6Ik5VTjlka2MifQ.0k-6s3mWkXrSYDcQrrLGDg'
      })
    });

	this.map = new ol.Map({
	  layers: [this.raster, this.heatmapLayer],
	  target: this.div,
	  view: new ol.View({
	    center: [0, 0],
	    zoom: 2
	  })
	});


}

heatMap.prototype._addPoint = function(x,y,val) {
	var point = new ol.Feature({
		geometry:new ol.geom.Point(ol.proj.transform([y,x], 'EPSG:4326', 'EPSG:3857')),
		weight:val
	});

	this.data.addFeature(point);
}

heatMap.prototype.setData = function(data) {
	
	var rawData = [];

	var cons = data.hits.hits;

	for (i in cons) {
		var observation = cons[i]["_source"];
		rawData.push(observation);
		if (typeof observation.location != "undefined") {
			var val = observation.variance;
			this._addPoint(observation.location.lat,observation.location.lon,val);
		}
	}

}





