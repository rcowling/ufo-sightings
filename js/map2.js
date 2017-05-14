 var CARTOCSS = [
          'Map {',
          '-torque-time-attribute: "date_time";',
          '-torque-aggregation-function: "count(cartodb_id)";',
          '-torque-frame-count: 760;',
          '-torque-animation-duration: 15;',
          '-torque-resolution: 2',
          '}',
          '#layer {',
          '  marker-width: 3;',
          '  marker-fill-opacity: 0.8;',
          '  marker-fill: #FEE391; ',
          '  comp-op: "lighten";',
          '  [value > 2] { marker-fill: #FEC44F; }',
          '  [value > 3] { marker-fill: #FE9929; }',
          '  [value > 4] { marker-fill: #EC7014; }',
          '  [value > 5] { marker-fill: #CC4C02; }',
          '  [value > 6] { marker-fill: #993404; }',
          '  [value > 7] { marker-fill: #662506; }',
          '  [frame-offset = 1] { marker-width: 10; marker-fill-opacity: 0.05;}',
          '  [frame-offset = 2] { marker-width: 15; marker-fill-opacity: 0.02;}',
          '}'
      ].join('\n');
   
      var torqueLayer = new L.TorqueLayer({
        user       : 'wesweaver',
        table      : 'ufo_sightings_2015',
        zIndex: 100,
        cartocss: CARTOCSS
      });
      torqueLayer.error(function(err){
        for(error in err){
          console.warn(err[error]);
        }
      });
      torqueLayer.addTo(map);
      torqueLayer.play()