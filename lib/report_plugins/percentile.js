'use strict';

var palette = require('./palette');

var percentile = {
  name: 'percentile'
  , label: 'Percentile Chart'
  , pluginType: 'report'
};

function init() {
  return percentile;
}

module.exports = init;

percentile.html = function html(client) {
  var translate = client.translate;
  var ret =
  '<h2 class="rp-h2">'
  + translate('Glucose Percentile report')
  + ' <span class="rp-h2-sub">('
  + '<span id="percentile-days"></span>'
  + ')</span>'
  + '</h2>'
  + '<div class="rp-card"><div style="height:460px;">'
  + '  <div class="chart" id="percentile-chart"></div>'
  + '</div></div>'
  ;

  return ret;
};

percentile.css =
    '#percentile-chart {'
  + '  width: 100%;'
  + '  height: 100%;'
  + '}'
  ;

percentile.report = function report_percentile(datastorage, sorteddaystoshow, options) {
  var Nightscout = window.Nightscout;
  var client = Nightscout.client;
  var translate = client.translate;
  var moment = window.moment;
  var profile = client.sbx.data.profile;
  var ss = require('simple-statistics');

  var minutewindow = 30; //minute-window should be a divisor of 60

  var data = datastorage.allstatsrecords;

  var bins = [];
  var filterFunc = function withinWindow(record) {
    var recdate = profile.applyTimezone(moment(record.displayTime));
    return recdate.hour() === hour && recdate.minute() >= minute && recdate.minute() < minute + minutewindow;
  };

  var reportPlugins = Nightscout.report_plugins;
  var firstDay = reportPlugins.utils.localeDate(sorteddaystoshow[sorteddaystoshow.length - 1]);
  var lastDay = reportPlugins.utils.localeDate(sorteddaystoshow[0]);
  var countDays = sorteddaystoshow.length;

  $('#percentile-days').text(countDays + ' ' + translate('days total') + ', ' + firstDay + ' - ' + lastDay);

  for (var hour = 0; hour < 24; hour++) {
    for (var minute = 0; minute < 60; minute = minute + minutewindow) {
      var date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);
      var readings = data.filter(filterFunc);
      readings = readings.map(function(record) {
        return record.sgv;
      });
      bins.push([date, readings]);
      //console.log(date +  " - " + readings.length);
      //readings.forEach(function(x){console.log(x)});
    }
  }
  var dat10 = bins.map(function(bin) {
    return [bin[0], ss.quantile(bin[1], 0.1)];
  });
  var dat25 = bins.map(function(bin) {
    return [bin[0], ss.quantile(bin[1], 0.25)];
  });
  var dat50 = bins.map(function(bin) {
    return [bin[0], ss.quantile(bin[1], 0.5)];
  });
  var dat75 = bins.map(function(bin) {
    return [bin[0], ss.quantile(bin[1], 0.75)];
  });
  var dat90 = bins.map(function(bin) {
    return [bin[0], ss.quantile(bin[1], 0.9)];
  });
  var high = options.targetHigh;
  var low = options.targetLow;
  //dat50.forEach(function(x){console.log(x[0] + " - " + x[1])});
  $.plot(
    '#percentile-chart', [{
      label: translate('Median'),
      data: dat50,
      id: 'c50',
      color: palette.median,
      points: {
        show: false
      },
      lines: {
        show: true,
        //fill: true
      }
    }, {
      label: '25%/75% '+translate('percentile'),
      data: dat25,
      id: 'c25',
      color: palette.bandInner,
      points: {
        show: false
      },
      lines: {
        show: true,
        fill: true
      },
      fillBetween: 'c50'
    }, {
      data: dat75,
      id: 'c75',
      color: palette.bandInner,
      points: {
        show: false
      },
      lines: {
        show: true,
        fill: true
      },
      fillBetween: 'c50'
    }, {
      label: '10%/90% '+translate('percentile'),
      data: dat10,
      id: 'c10',
      color: palette.bandOuter,
      points: {
        show: false
      },
      lines: {
        show: true,
        fill: true
      },
      fillBetween: 'c25'
    }, {
      data: dat90,
      id: 'c90',
      color: palette.bandOuter,
      points: {
        show: false
      },
      lines: {
        show: true,
        fill: true
      },
      fillBetween: 'c75'
    }, {
      label: translate('High'),
      data: [],
      color: palette.tiers.high,
    }, {
      label: translate('Low'),
      data: [],
      color: palette.tiers.low,
    }], {
      xaxis: {
        mode: 'time',
        timezone: 'browser',
        timeformat: '%H:%M',
        tickColor: palette.hairline,
      },
      yaxis: {
        min: 0,
        max: options.units === 'mmol' ? 22: 400,
        tickColor: palette.hairline,
      },
      grid: {
        backgroundColor: palette.surface,
        borderColor: palette.grid,
        borderWidth: 1,
        color: palette.inkMuted,
        markings: [{
          color: palette.targetBand,
          yaxis: {
            from: low,
            to: high
          }
        }, {
          color: palette.tiers.low,
          lineWidth: 1,
          yaxis: {
            from: low,
            to: low
          }
        }, {
          color: palette.tiers.high,
          lineWidth: 1,
          yaxis: {
            from: high,
            to: high
          }
        }],
        //hoverable: true
      }
    }
  );
};
