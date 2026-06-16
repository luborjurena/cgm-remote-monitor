'use strict';

var d3 = (global && global.d3) || require('d3');

var consts = require('../constants');

var glucosedistribution = {
  name: 'glucosedistribution'
  , label: 'Distribution'
  , pluginType: 'report'
};

function init () {
  return glucosedistribution;
}

module.exports = init;

glucosedistribution.html = function html (client) {
  var translate = client.translate;
  var ret =
    '<div class="gd-report">' +
    '<h2 class="gd-h2">' +
    translate('Glucose distribution') +
    ' <span class="gd-h2-sub">(<span id="glucosedistribution-days"></span>)</span>' +
    '</h2>' +
    // Range-metric selector + time-in-ranges bar + legend.
    '<div class="gd-card">' +
    '<div class="gd-rangemetrics">' +
    '<span class="gd-rangemetrics-title">' + translate('Range metrics') + '</span>' +
    '<label><input type="radio" name="gd-rangemetric" value="standard" checked> ' + translate('Standard (Time in Range)') + '</label>' +
    '<label><input type="radio" name="gd-rangemetric" value="tight"> ' + translate('Tight Range') + '</label>' +
    '<label><input type="radio" name="gd-rangemetric" value="custom"> ' + translate('Custom (report targets)') + '</label>' +
    '</div>' +
    '<div id="glucosedistribution-tirbar"></div>' +
    '<div id="glucosedistribution-tirlegend"></div>' +
    '</div>' +
    // Key metrics tiles.
    '<div class="gd-card">' +
    '<div class="gd-card-title">' + translate('Glucose statistics') + '</div>' +
    '<div id="glucosedistribution-tirmetrics" class="gd-tiles"></div>' +
    '</div>' +
    // Ambulatory Glucose Profile (AGP) percentile curve.
    '<div class="gd-card">' +
    '<div class="gd-card-title">' + translate('Ambulatory Glucose Profile (AGP)') + '</div>' +
    '<div id="glucosedistribution-agp"></div>' +
    '<div class="agp-legend">' +
    '<div class="agp-legend-item"><span class="agp-legend-line"></span>' + translate('Median') + ' (50%)</div>' +
    '<div class="agp-legend-item"><span class="agp-legend-swatch" style="background:#6fa8dc"></span>25–75%</div>' +
    '<div class="agp-legend-item"><span class="agp-legend-swatch" style="background:#cfe2f3"></span>5–95%</div>' +
    '<div class="agp-legend-item"><span class="agp-legend-swatch" style="background:rgba(67,160,71,.25)"></span>' + translate('Target Range') + '</div>' +
    '</div>' +
    '</div>' +
    // Distribution table + variability / stability.
    '<div class="gd-row">' +
    '<div class="gd-card gd-card-grow">' +
    '<div class="gd-card-title">' + translate('Glucose distribution') + '</div>' +
    '<div id="glucosedistribution-report"></div>' +
    '</div>' +
    '<div class="gd-card">' +
    '<div class="gd-card-title">' + translate('Variability') + '</div>' +
    '<div id="glucosedistribution-stability"></div>' +
    '</div>' +
    '</div>' +
    '<div class="gd-card gd-notes" id="explanation">' +
    '* ' + translate('This is only a rough estimation that can be very inaccurate and does not replace actual blood testing. The formula used is taken from:') +
    'Nathan, David M., et al. "Translating the A1C assay into estimated average glucose values." <i>Diabetes care</i> 31.8 (2008): 1473-1478.' + '<br/><br/>' +
    '* ' + translate('GMI (Glucose Management Indicator) estimates the laboratory A1c you would likely have, based on your average glucose. CV (Coefficient of Variation) measures glucose variability; a value at or below 36% is considered stable.') + '<br/><br/>' +
    translate('Time in fluctuation and Time in rapid fluctuation measure the % of time during the examined period, during which the blood glucose has been changing relatively fast or rapidly. Lower values are better.') + '<br/><br/>' +
    translate('Mean Total Daily Change is a sum of the absolute value of all glucose excursions for the examined period, divided by the number of days. Lower is better.') + '<br/><br/>' +
    translate('Mean Hourly Change is a sum of the absolute value of all glucose excursions for the examined period, divided by the number of hours in the period. Lower is better.') + '<br/><br/>' +
    translate('Out of Range RMS is calculated by squaring the distance out of range for all glucose readings for the examined period, summing them, dividing by the count and taking the square root. This metric is similar to in-range percentage but weights readings far out of range higher. Lower values are better.') + '<br/><br/>' +
    translate('GVI (Glycemic Variability Index) and PGS (Patient Glycemic Status) are measures developed by Dexcom, detailed <a href="') +
    'https://web.archive.org/web/20160523152519/http://www.healthline.com/diabetesmine/a-new-view-of-glycemic-variability-how-long-is-your-line' +
    translate('">can be found here</a>.') +
    '</div>' +
    '<div class="gd-card gd-hours">' +
    '<span class="gd-hours-title">' + translate('Filter by hours') + '</span>' +
    '<span class="gd-hours-boxes">' +
    '0<input type="checkbox" id="glucosedistribution-0" checked>' +
    '1<input type="checkbox" id="glucosedistribution-1" checked>' +
    '2<input type="checkbox" id="glucosedistribution-2" checked>' +
    '3<input type="checkbox" id="glucosedistribution-3" checked>' +
    '4<input type="checkbox" id="glucosedistribution-4" checked>' +
    '5<input type="checkbox" id="glucosedistribution-5" checked>' +
    '6<input type="checkbox" id="glucosedistribution-6" checked>' +
    '7<input type="checkbox" id="glucosedistribution-7" checked>' +
    '8<input type="checkbox" id="glucosedistribution-8" checked>' +
    '9<input type="checkbox" id="glucosedistribution-9" checked>' +
    '10<input type="checkbox" id="glucosedistribution-10" checked>' +
    '11<input type="checkbox" id="glucosedistribution-11" checked>' +
    '12<input type="checkbox" id="glucosedistribution-12" checked>' +
    '13<input type="checkbox" id="glucosedistribution-13" checked>' +
    '14<input type="checkbox" id="glucosedistribution-14" checked>' +
    '15<input type="checkbox" id="glucosedistribution-15" checked>' +
    '16<input type="checkbox" id="glucosedistribution-16" checked>' +
    '17<input type="checkbox" id="glucosedistribution-17" checked>' +
    '18<input type="checkbox" id="glucosedistribution-18" checked>' +
    '19<input type="checkbox" id="glucosedistribution-19" checked>' +
    '20<input type="checkbox" id="glucosedistribution-20" checked>' +
    '21<input type="checkbox" id="glucosedistribution-21" checked>' +
    '22<input type="checkbox" id="glucosedistribution-22" checked>' +
    '23<input type="checkbox" id="glucosedistribution-23" checked>' +
    '</span>' +
    '</div>' +
    '</div>';
  return ret;
};

glucosedistribution.css =
  '#glucosedistribution-placeholder{width:100%;background:#f4f6f9;}' +
  '.gd-report{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
  '  color:#23303d;padding:4px 2px 24px;}' +
  '.gd-report *{box-sizing:border-box;}' +
  '.gd-h2{font-size:20px;font-weight:700;margin:6px 2px 16px;}' +
  '.gd-h2-sub{font-size:14px;font-weight:400;color:#7a8a99;}' +
  '.gd-card{background:#fff;border:1px solid #e6ebf0;border-radius:14px;' +
  '  box-shadow:0 1px 3px rgba(16,32,48,.06);padding:16px 18px;margin:0 0 16px 0;}' +
  '.gd-card-title{font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;' +
  '  color:#7a8a99;margin:0 0 12px;}' +
  '.gd-row{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;}' +
  '.gd-row>.gd-card{flex:1 1 320px;margin-bottom:16px;}' +
  '.gd-card-grow{flex:2 1 520px;}' +
  // range metrics selector
  '.gd-rangemetrics{display:flex;flex-wrap:wrap;align-items:center;gap:6px 16px;' +
  '  margin:0 0 14px;font-size:13px;}' +
  '.gd-rangemetrics-title{font-size:12px;font-weight:600;letter-spacing:.05em;' +
  '  text-transform:uppercase;color:#7a8a99;margin-right:4px;}' +
  '.gd-rangemetrics label{cursor:pointer;display:inline-flex;align-items:center;gap:5px;}' +
  // TIR bar
  '#glucosedistribution-tirbar{display:flex;height:40px;width:100%;' +
  '  border-radius:10px;overflow:hidden;margin:4px 0 14px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.05);}' +
  '.gd-tir-seg{display:flex;align-items:center;justify-content:center;color:#fff;' +
  '  font-size:12px;font-weight:700;min-width:0;overflow:hidden;white-space:nowrap;}' +
  '#glucosedistribution-tirlegend{display:flex;flex-wrap:wrap;gap:8px 24px;font-size:13px;}' +
  '.gd-legend-item{display:flex;align-items:center;gap:6px;}' +
  '.gd-legend-swatch{width:14px;height:14px;border-radius:4px;display:inline-block;}' +
  // metric tiles
  '.gd-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:12px;}' +
  '.gd-tile{padding:12px 14px;border-radius:12px;background:#f7f9fb;border:1px solid #eef2f6;}' +
  '.gd-tile-value{font-size:23px;font-weight:700;line-height:1.05;}' +
  '.gd-tile-label{font-size:11px;color:#7a8a99;margin-top:5px;line-height:1.3;}' +
  // AGP curve
  '#glucosedistribution-agp{width:100%;}' +
  '.agp-svg{width:100%;height:auto;aspect-ratio:1100/320;display:block;}' +
  '.agp-target-band{fill:rgba(67,160,71,.12);}' +
  '.agp-band-outer{fill:#cfe2f3;opacity:.85;}' +
  '.agp-band-inner{fill:#6fa8dc;opacity:.8;}' +
  '.agp-median{fill:none;stroke:#1c4587;stroke-width:2.5;stroke-linejoin:round;}' +
  '.agp-target-line{stroke:#43a047;stroke-width:1.5;stroke-dasharray:5 4;opacity:.8;}' +
  '.agp-axis path,.agp-axis line{stroke:#dfe6ec;}' +
  '.agp-axis text{fill:#7a8a99;font-size:11px;}' +
  '.agp-legend{display:flex;flex-wrap:wrap;gap:14px 24px;margin:10px 0 0;font-size:12px;color:#5b6b7a;}' +
  '.agp-legend-item{display:flex;align-items:center;gap:6px;}' +
  '.agp-legend-swatch{width:16px;height:10px;border-radius:3px;display:inline-block;}' +
  '.agp-legend-line{width:16px;height:0;border-top:2.5px solid #1c4587;}' +
  // tables
  '.gd-report table{border-collapse:collapse;width:100%;font-size:13px;}' +
  '.gd-report th{font-size:11px;font-weight:600;letter-spacing:.02em;color:#7a8a99;' +
  '  padding:6px 8px;border-bottom:2px solid #eef2f6;text-align:center;vertical-align:bottom;}' +
  '#glucosedistribution-placeholder .tdborder{border:none;border-bottom:1px solid #eef2f6;' +
  '  padding:7px 8px;text-align:center;}' +
  '.gd-report tbody tr:last-child .tdborder{border-bottom:none;}' +
  '.gd-tier-cell{text-align:left;white-space:nowrap;}' +
  '.gd-dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:8px;vertical-align:middle;}' +
  '.gd-tier-range{color:#9aa7b3;font-weight:400;}' +
  '.gd-overall .tdborder{border-top:2px solid #eef2f6;font-weight:600;}' +
  // notes + hours
  '.gd-notes{font:11px/1.6 Verdana,Arial,sans-serif;color:#8492a0;}' +
  '.gd-hours{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;}' +
  '.gd-hours-title{font-size:12px;font-weight:600;letter-spacing:.05em;' +
  '  text-transform:uppercase;color:#7a8a99;}' +
  '.gd-hours-boxes{font-size:12px;color:#5b6b7a;}' +
  '.gd-hours-boxes input{margin:0 8px 0 2px;vertical-align:middle;}';

glucosedistribution.report = function report_glucosedistribution (datastorage, sorteddaystoshow, options) {
  var Nightscout = window.Nightscout;
  var client = Nightscout.client;
  var translate = client.translate;
  var displayUnits = Nightscout.client.settings.units;

  var ss = require('simple-statistics');

  var isMmol = displayUnits === 'mmol';
  var MMOL = consts.MMOL_TO_MGDL;
  function dispVal (mgdl) { return isMmol ? (mgdl / MMOL).toFixed(1) : Math.round(mgdl).toString(); }
  var unitLabel = isMmol ? 'mmol/L' : 'mg/dL';

  // Fixed clinical thresholds (mg/dL).
  var VERY_LOW = 54;    // 3.0 mmol/L
  var STD_LOW = 70;     // 3.9 mmol/L
  var TIGHT_HIGH = 140; // 7.8 mmol/L
  var STD_HIGH = 180;   // 10.0 mmol/L
  var VERY_HIGH = 250;  // 13.9 mmol/L

  // Selected range-metric mode determines the in-range boundaries.
  var mode = $('input[name="gd-rangemetric"]:checked').val() || 'standard';
  $('input[name="gd-rangemetric"]').off('change').on('change', onClick);

  var lowMgdl, highMgdl;
  if (mode === 'tight') {
    lowMgdl = STD_LOW;
    highMgdl = TIGHT_HIGH;
  } else if (mode === 'custom') {
    lowMgdl = isMmol ? options.targetLow * MMOL : options.targetLow;
    highMgdl = isMmol ? options.targetHigh * MMOL : options.targetHigh;
  } else {
    lowMgdl = STD_LOW;
    highMgdl = STD_HIGH;
  }

  var tierColors = {
    veryLow: '#a32020'
    , low: '#ee5e5e'
    , inRange: '#43a047'
    , high: '#f4c430'
    , veryHigh: '#ef8c1a'
  };
  // tiers with a light fill need dark text for readable contrast
  var darkTextTiers = { high: true };
  function tierTextColor (key) { return darkTextTiers[key] ? '#333' : '#fff'; }

  var report = $('#glucosedistribution-report');
  report.empty();

  var stability = $('#glucosedistribution-stability');
  stability.empty();

  $('#glucosedistribution-tirbar').empty();
  $('#glucosedistribution-tirlegend').empty();
  $('#glucosedistribution-tirmetrics').empty();
  $('#glucosedistribution-agp').empty();

  var enabledHours = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];

  var data = datastorage.allstatsrecords;
  var days = datastorage.alldays;

  var reportPlugins = Nightscout.report_plugins;
  var firstDay = reportPlugins.utils.localeDate(sorteddaystoshow[sorteddaystoshow.length - 1]);
  var lastDay = reportPlugins.utils.localeDate(sorteddaystoshow[0]);

  $('#glucosedistribution-days').text(days + ' ' + translate('days total') + ', ' + firstDay + ' - ' + lastDay);

  for (var i = 0; i < 24; i++) {
    $('#glucosedistribution-' + i).unbind('click').click(onClick);
    enabledHours[i] = $('#glucosedistribution-' + i).is(':checked');
  }

  // Filter data for noise
  // data cleaning pass 0 - remove duplicates and non-sgv entries, sort
  var seen = [];
  data = data.filter(function(item) {
    if (!item.sgv || !item.bgValue || !item.displayTime || item.bgValue < 39) {
      console.log(item);
      return false;
    }
    return seen.includes(item.displayTime) ? false : (seen[item.displayTime] = true);
  });

  if (data.length === 0) {
    $('#glucosedistribution-days').text(translate('Result is empty'));
    return;
  }

  data.sort(function(a, b) {
    return a.displayTime.getTime() - b.displayTime.getTime();
  });

  var glucose_data = [data[0]];

  // data cleaning pass 1 - add interpolated missing points
  for (i = 0; i <= data.length - 2; i++) {
    var entry = data[i];
    var nextEntry = data[i + 1];

    var timeDelta = nextEntry.displayTime.getTime() - entry.displayTime.getTime();

    if (timeDelta < 9 * 60 * 1000 || timeDelta > 25 * 60 * 1000) {
      glucose_data.push(entry);
      continue;
    }

    var missingRecords = Math.floor(timeDelta / (5 * 60 * 990)) - 1;

    var timePatch = Math.floor(timeDelta / (missingRecords + 1));
    var bgDelta = (nextEntry.bgValue - entry.bgValue) / (missingRecords + 1);

    glucose_data.push(entry);

    for (var j = 1; j <= missingRecords; j++) {
      var bg = Math.floor(entry.bgValue + bgDelta * j);
      var t = new Date(entry.displayTime.getTime() + j * timePatch);
      var newEntry = {
        sgv: displayUnits === 'mmol' ? bg / consts.MMOL_TO_MGDL : bg
        , bgValue: bg
        , displayTime: t
      };
      glucose_data.push(newEntry);
    }
  }
  // Need to add the last record, after interpolating between points
  glucose_data.push(data[data.length - 1]);

  // data cleaning pass 2 - replace single jumpy measures with interpolated values
  var glucose_data2 = [glucose_data[0]];
  var prevEntry = glucose_data[0];

  const maxGap = (5 * 60 * 1000) + 10000;

  for (i = 1; i <= glucose_data.length - 2; i++) {
    let entry = glucose_data[i];
    let nextEntry = glucose_data[i + 1];

    let timeDelta = nextEntry.displayTime.getTime() - entry.displayTime.getTime();
    let timeDelta2 = entry.displayTime.getTime() - prevEntry.displayTime.getTime();

    if (timeDelta > maxGap || timeDelta2 > maxGap) {
      glucose_data2.push(entry);
      prevEntry = entry;
      continue;
    }

    var delta1 = entry.bgValue - prevEntry.bgValue;
    var delta2 = nextEntry.bgValue - entry.bgValue;

    if (delta1 <= 8 && delta2 <= 8) {
      glucose_data2.push(entry);
      prevEntry = entry;
      continue;
    }

    if ((delta1 > 0 && delta2 < 0) || (delta1 < 0 && delta2 > 0)) {
      const d = (nextEntry.bgValue - prevEntry.bgValue) / 2;
      const interpolatedValue = prevEntry.bgValue + d;

      let newEntry = {
        sgv: displayUnits === 'mmol' ? interpolatedValue / consts.MMOL_TO_MGDL : interpolatedValue
        , bgValue: interpolatedValue
        , displayTime: entry.displayTime
      };
      glucose_data2.push(newEntry);
      prevEntry = newEntry;
      continue;
    }

    glucose_data2.push(entry);
    prevEntry = entry;
  }
  // Need to add the last record, after interpolating between points
  glucose_data2.push(glucose_data[glucose_data.length - 1]);

  glucose_data = data = glucose_data2.filter(function(r) {
    return enabledHours[new Date(r.displayTime).getHours()]
  });

  glucose_data.sort(function(a, b) {
    return a.displayTime.getTime() - b.displayTime.getTime();
  });

  if (data.length === 0) {
    $('#glucosedistribution-days').text(translate('Result is empty'));
    return;
  }

  var timeTotal = 0;
  for (i = 1; i <= glucose_data.length - 2; i++) {
    let entry = glucose_data[i];
    let nextEntry = glucose_data[i + 1];
    let timeDelta = nextEntry.displayTime.getTime() - entry.displayTime.getTime();
    if (timeDelta < maxGap) {
      timeTotal += timeDelta;
    }
  }

  var daysTotal = timeTotal / (1000 * 60 * 60 * 24);

  // === 5-tier time-in-ranges breakdown =====================================
  var tierDefs = [
    { key: 'veryLow', label: translate('Very Low'), color: tierColors.veryLow
      , test: function (v) { return v < VERY_LOW; }, range: '<' + dispVal(VERY_LOW) }
    , { key: 'low', label: translate('Low'), color: tierColors.low
      , test: function (v) { return v >= VERY_LOW && v < lowMgdl; }, range: dispVal(VERY_LOW) + '–' + dispVal(lowMgdl) }
    , { key: 'inRange', label: translate('In Range'), color: tierColors.inRange
      , test: function (v) { return v >= lowMgdl && v <= highMgdl; }, range: dispVal(lowMgdl) + '–' + dispVal(highMgdl) }
    , { key: 'high', label: translate('High'), color: tierColors.high
      , test: function (v) { return v > highMgdl && v <= VERY_HIGH; }, range: dispVal(highMgdl) + '–' + dispVal(VERY_HIGH) }
    , { key: 'veryHigh', label: translate('Very High'), color: tierColors.veryHigh
      , test: function (v) { return v > VERY_HIGH; }, range: '>' + dispVal(VERY_HIGH) }
  ];

  var total = data.length;
  var inRangePct = 0;
  tierDefs.forEach(function (t) {
    t.records = data.filter(function (r) { return t.test(r.bgValue); });
    t.count = t.records.length;
    t.pct = total > 0 ? 100 * t.count / total : 0;
    var bgs = t.records.map(function (r) { return r.sgv; }).filter(function (b) { return !!b; });
    if (bgs.length > 0) {
      t.mean = ss.mean(bgs);
      t.median = ss.quantile(bgs, 0.5);
      t.stddev = ss.standard_deviation(bgs);
    }
    if (t.key === 'inRange') inRangePct = t.pct;
  });

  // overall statistics
  var allMgdl = data.map(function (r) { return r.bgValue; }).filter(function (v) { return !isNaN(v); });
  var allDisp = data.map(function (r) { return r.sgv; }).filter(function (b) { return !!b; });
  var meanMgdl = ss.mean(allMgdl);
  var sdMgdl = ss.standard_deviation(allMgdl);
  var gmi = 3.31 + 0.02392 * meanMgdl;
  var cv = meanMgdl > 0 ? sdMgdl / meanMgdl * 100 : 0;

  function pctWhere (test) {
    return total > 0 ? 100 * data.filter(function (r) { return test(r.bgValue); }).length / total : 0;
  }

  // === stacked bar =========================================================
  var bar = $('#glucosedistribution-tirbar');
  tierDefs.forEach(function (t) {
    var seg = $('<div class="gd-tir-seg">')
      .css('background', t.color)
      .css('color', tierTextColor(t.key))
      .css('width', t.pct.toFixed(2) + '%')
      .attr('title', t.label + ' (' + t.range + ' ' + unitLabel + '): ' + t.pct.toFixed(1) + '%');
    if (t.pct >= 7) seg.text(t.pct.toFixed(1) + '%');
    bar.append(seg);
  });

  // === legend ==============================================================
  var legend = $('#glucosedistribution-tirlegend');
  tierDefs.forEach(function (t) {
    var item = $('<div class="gd-legend-item">');
    item.append($('<span class="gd-legend-swatch">').css('background', t.color));
    item.append($('<span>')
      .append($('<b>').css('color', t.color).text(t.label))
      .append(document.createTextNode(' (' + t.range + '): '))
      .append($('<b>').text(t.pct.toFixed(1) + '%')));
    legend.append(item);
  });

  // === key metrics tiles ===================================================
  var metrics = $('#glucosedistribution-tirmetrics');
  function tile (value, name, sub, valueColor) {
    var t = $('<div class="gd-tile">');
    var v = $('<div class="gd-tile-value">').text(value);
    if (valueColor) v.css('color', valueColor);
    t.append(v);
    var label = $('<div class="gd-tile-label">').text(name);
    if (sub) label.append($('<br>')).append(document.createTextNode(sub));
    t.append(label);
    metrics.append(t);
  }
  tile(pctWhere(function (v) { return v < VERY_LOW; }).toFixed(1) + '%'
    , translate('Time Below'), '< ' + dispVal(VERY_LOW), tierColors.veryLow);
  tile(pctWhere(function (v) { return v < lowMgdl; }).toFixed(1) + '%'
    , translate('Time Below'), '< ' + dispVal(lowMgdl), tierColors.low);
  tile(pctWhere(function (v) { return v >= lowMgdl && v <= highMgdl; }).toFixed(1) + '%'
    , translate('Time in Range'), dispVal(lowMgdl) + '–' + dispVal(highMgdl) + ' ' + unitLabel, tierColors.inRange);
  tile(pctWhere(function (v) { return v >= STD_LOW && v <= TIGHT_HIGH; }).toFixed(1) + '%'
    , translate('Time in Tight Range'), dispVal(STD_LOW) + '–' + dispVal(TIGHT_HIGH) + ' ' + unitLabel, tierColors.inRange);
  tile(pctWhere(function (v) { return v > highMgdl; }).toFixed(1) + '%'
    , translate('Time Above'), '> ' + dispVal(highMgdl), tierColors.high);
  tile(pctWhere(function (v) { return v > VERY_HIGH; }).toFixed(1) + '%'
    , translate('Time Above'), '> ' + dispVal(VERY_HIGH), tierColors.veryHigh);
  tile(gmi.toFixed(1) + '%', 'GMI', translate('Estimated A1c'));
  tile(cv.toFixed(1) + '%', 'CV', translate('Goal') + ': ≤ 36%', cv <= 36 ? tierColors.inRange : tierColors.high);

  // === AGP percentile curve ================================================
  var targetLowDisp = isMmol ? lowMgdl / MMOL : lowMgdl;
  var targetHighDisp = isMmol ? highMgdl / MMOL : highMgdl;

  var stepMin = 15;
  var halfWindow = 45; // +/- 45 min => 90-minute smoothing window
  var byMinute = data.map(function (r) {
    var d = new Date(r.displayTime);
    return { m: d.getHours() * 60 + d.getMinutes(), v: r.sgv };
  }).filter(function (o) { return !isNaN(o.v); });

  var series = [];
  for (var mm = 0; mm <= 1440; mm += stepMin) {
    var lo = mm - halfWindow;
    var hi = mm + halfWindow;
    var vals = [];
    for (var w = 0; w < byMinute.length; w++) {
      if (byMinute[w].m >= lo && byMinute[w].m <= hi) vals.push(byMinute[w].v);
    }
    if (vals.length >= 3) {
      series.push({
        minute: mm
        , p05: ss.quantile(vals, 0.05)
        , p25: ss.quantile(vals, 0.25)
        , p50: ss.quantile(vals, 0.5)
        , p75: ss.quantile(vals, 0.75)
        , p95: ss.quantile(vals, 0.95)
      });
    }
  }

  if (series.length >= 2) {
    drawAgpCurve('#glucosedistribution-agp', series, {
      isMmol: isMmol
      , targetLowDisp: targetLowDisp
      , targetHighDisp: targetHighDisp
    });
  }

  // === distribution table (5-tier) =========================================
  var table = $('<table class="centeraligned">');
  var thead = $('<tr/>');
  $('<th>' + translate('Range') + '</th>').appendTo(thead);
  $('<th>' + translate('% of Readings') + '</th>').appendTo(thead);
  $('<th>' + translate('# of Readings') + '</th>').appendTo(thead);
  $('<th>' + translate('Average') + '</th>').appendTo(thead);
  $('<th>' + translate('Median') + '</th>').appendTo(thead);
  $('<th>' + translate('Standard Deviation') + '</th>').appendTo(thead);
  $('<th>' + translate('A1c estimation*') + '</th>').appendTo(thead);
  thead.appendTo(table);

  tierDefs.forEach(function (t) {
    var tr = $('<tr>');
    $('<td class="tdborder gd-tier-cell"><span class="gd-dot" style="background:' + t.color + '"></span><strong>' + t.label + '</strong> <span class="gd-tier-range">(' + t.range + ' ' + unitLabel + ')</span></td>').appendTo(tr);
    $('<td class="tdborder">' + t.pct.toFixed(1) + '%</td>').appendTo(tr);
    $('<td class="tdborder">' + t.count + '</td>').appendTo(tr);
    if (t.count > 0) {
      $('<td class="tdborder">' + t.mean.toFixed(1) + '</td>').appendTo(tr);
      $('<td class="tdborder">' + t.median.toFixed(1) + '</td>').appendTo(tr);
      $('<td class="tdborder">' + t.stddev.toFixed(1) + '</td>').appendTo(tr);
      $('<td> </td>').appendTo(tr);
    } else {
      $('<td class="tdborder">N/A</td>').appendTo(tr);
      $('<td class="tdborder">N/A</td>').appendTo(tr);
      $('<td class="tdborder">N/A</td>').appendTo(tr);
      $('<td class="tdborder"> </td>').appendTo(tr);
    }
    table.append(tr);
  });

  var overallTr = $('<tr class="gd-overall">');
  $('<td class="tdborder gd-tier-cell"><strong>' + translate('Overall') + '</strong></td>').appendTo(overallTr);
  $('<td class="tdborder"> </td>').appendTo(overallTr);
  $('<td class="tdborder">' + total + '</td>').appendTo(overallTr);
  if (total > 0) {
    $('<td class="tdborder">' + (Math.round(10 * ss.mean(allDisp)) / 10).toFixed(1) + '</td>').appendTo(overallTr);
    $('<td class="tdborder">' + (Math.round(10 * ss.quantile(allDisp, 0.5)) / 10).toFixed(1) + '</td>').appendTo(overallTr);
    $('<td class="tdborder">' + (Math.round(ss.standard_deviation(allDisp) * 10) / 10).toFixed(1) + '</td>').appendTo(overallTr);
    $('<td class="tdborder"><center>' + (Math.round(10 * (meanMgdl + 46.7) / 28.7) / 10).toFixed(1) + '%<sub>DCCT</sub> | ' + Math.round(((meanMgdl + 46.7) / 28.7 - 2.15) * 10.929) + '<sub>IFCC</sub></center></td>').appendTo(overallTr);
  } else {
    $('<td class="tdborder">N/A</td>').appendTo(overallTr);
    $('<td class="tdborder">N/A</td>').appendTo(overallTr);
    $('<td class="tdborder">N/A</td>').appendTo(overallTr);
    $('<td class="tdborder">N/A</td>').appendTo(overallTr);
  }
  table.append(overallTr);
  report.append(table);

  // === Stability ===========================================================
  var t1 = 6;
  var t2 = 11;
  var t1count = 0;
  var t2count = 0;

  var events = 0;

  var GVITotal = 0;
  var GVIIdeal = 0;
  var GVIIdeal_Time = 0;

  var RMSTotal = 0;

  var usedRecords = 0;
  var glucoseTotal = 0;
  var deltaTotal = 0;

  for (i = 0; i <= glucose_data.length - 2; i++) {
    const entry = glucose_data[i];
    const nextEntry = glucose_data[i + 1];
    const timeDelta = nextEntry.displayTime.getTime() - entry.displayTime.getTime();

    // Use maxGap constant
    if (timeDelta == 0 || timeDelta > maxGap) { // 6 * 60 * 1000) {
      // console.log("Record skipped");
      continue;
    }

    usedRecords += 1;
    events += 1;

    var delta = Math.abs(nextEntry.bgValue - entry.bgValue);
    deltaTotal += delta;

    if (delta > 0) { // avoid divide by 0 error
      // Are we rising at faster than 5mg/DL/5minutes
      if ((delta / timeDelta) >= (t1 / (1000 * 60 * 5))) {
        t1count += 1;
      }
      // Are we rising at faster than 10mg/DL/5minutes
      if ((delta / timeDelta) >= (t2 / (1000 * 60 * 5))) {
        t2count += 1;
      }
    }

    // Calculate the distance travelled for this time step
    GVITotal += Math.sqrt(Math.pow(timeDelta / (1000 * 60), 2) + Math.pow(delta, 2));

    // Keep track of the number of minutes in this timestep
    GVIIdeal_Time += timeDelta / (1000 * 60);
    glucoseTotal += entry.bgValue;

    if (entry.bgValue < options.targetLow) {
      RMSTotal += Math.pow(options.targetLow - entry.bgValue, 2);
    }
    if (entry.bgValue > options.targetHigh) {
      RMSTotal += Math.pow(entry.bgValue - options.targetHigh, 2);
    }
  }

  // Difference between first and last reading
  var GVIDelta = Math.floor(glucose_data[0].bgValue - glucose_data[glucose_data.length - 1].bgValue);

  // Delta for total time considered against total period rise
  GVIIdeal = Math.sqrt(Math.pow(GVIIdeal_Time, 2) + Math.pow(GVIDelta, 2));

  var GVI = Math.round(GVITotal / GVIIdeal * 100) / 100;
  console.log('GVI', GVI, 'GVIIdeal', GVIIdeal, 'GVITotal', GVITotal, 'GVIIdeal_Time', GVIIdeal_Time);

  var glucoseMean = Math.floor(glucoseTotal / usedRecords);
  var tirMultiplier = inRangePct / 100.0;
  var PGS = Math.round(GVI * glucoseMean * (1 - tirMultiplier) * 100) / 100;
  console.log('glucoseMean', glucoseMean, 'tirMultiplier', tirMultiplier, 'PGS', PGS);

  var TDC = deltaTotal / daysTotal;
  var TDCHourly = TDC / 24.0;

  var RMS = Math.sqrt(RMSTotal / events);

  //  console.log('TADC',TDC,'days',days);

  var timeInT1 = Math.round(100 * t1count / events).toFixed(1);
  var timeInT2 = Math.round(100 * t2count / events).toFixed(1);

  var unitString = ' mg/dl';
  if (displayUnits == 'mmol') {
    TDC = TDC / consts.MMOL_TO_MGDL;
    TDCHourly = TDCHourly / consts.MMOL_TO_MGDL;
    unitString = ' mmol/L';

    RMS = Math.sqrt(RMSTotal / events) / consts.MMOL_TO_MGDL;
  }

  TDC = Math.round(TDC * 100) / 100;
  TDCHourly = Math.round(TDCHourly * 100) / 100;

  var stabilitytable = $('<table style="width: 100%;">');

  var t1exp = '>5 mg/dl/5m';
  var t2exp = '>10 mg/dl/5m';
  if (displayUnits == 'mmol') {
    t1exp = '>0.27 mmol/l/5m';
    t2exp = '>0.55 mmol/l/5m';
  }

  $('<tr><th>' + translate('Mean Total Daily Change') + '</th><th>' + translate('Time in fluctuation') + '<br>(' + t1exp + ')</th><th>' + translate('Time in rapid fluctuation') + '<br>(' + t2exp + ')</th></tr>').appendTo(stabilitytable);
  $('<tr><td class="tdborder">' + TDC + unitString + '</td><td class="tdborder">' + timeInT1 + '%</td><td class="tdborder">' + timeInT2 + '%</td></tr>').appendTo(stabilitytable);

  $('<tr><th>' + translate('Mean Hourly Change') + '</th><th>GVI</th><th>PGS</th></tr>').appendTo(stabilitytable);
  $('<tr><td class="tdborder">' + TDCHourly + unitString + '</td><td class="tdborder">' + GVI + '</td><td class="tdborder">' + PGS + '</td></tr>').appendTo(stabilitytable);

  $('<tr><th>Out of Range RMS</th></tr>').appendTo(stabilitytable);
  $('<tr><td class="tdborder">' + Math.round(RMS * 100) / 100 + unitString + '</td></tr>').appendTo(stabilitytable);
  stabilitytable.appendTo(stability);

  function onClick () {
    report_glucosedistribution(datastorage, sorteddaystoshow, options);
  }

  function drawAgpCurve (selector, dataSeries, opts) {
    var fullW = 1100;
    var fullH = 320;
    var margin = { top: 16, right: 16, bottom: 28, left: 46 };
    var width = fullW - margin.left - margin.right;
    var height = fullH - margin.top - margin.bottom;

    var svg = d3.select(selector).append('svg')
      .attr('class', 'agp-svg')
      .attr('viewBox', '0 0 ' + fullW + ' ' + fullH)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scaleLinear().domain([0, 1440]).range([0, width]);
    var yMax = opts.isMmol ? 21 : 350;
    var y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

    svg.append('rect')
      .attr('class', 'agp-target-band')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', y(opts.targetHighDisp))
      .attr('height', Math.max(0, y(opts.targetLowDisp) - y(opts.targetHighDisp)));

    var curveType = d3.curveCatmullRom.alpha(0.5);
    var areaOuter = d3.area().x(function (d) { return x(d.minute); })
      .y0(function (d) { return y(d.p05); }).y1(function (d) { return y(d.p95); }).curve(curveType);
    var areaInner = d3.area().x(function (d) { return x(d.minute); })
      .y0(function (d) { return y(d.p25); }).y1(function (d) { return y(d.p75); }).curve(curveType);
    var lineMedian = d3.line().x(function (d) { return x(d.minute); })
      .y(function (d) { return y(d.p50); }).curve(curveType);

    svg.append('path').datum(dataSeries).attr('class', 'agp-band-outer').attr('d', areaOuter);
    svg.append('path').datum(dataSeries).attr('class', 'agp-band-inner').attr('d', areaInner);
    svg.append('path').datum(dataSeries).attr('class', 'agp-median').attr('d', lineMedian);

    [opts.targetLowDisp, opts.targetHighDisp].forEach(function (t) {
      svg.append('line').attr('class', 'agp-target-line')
        .attr('x1', 0).attr('x2', width).attr('y1', y(t)).attr('y2', y(t));
    });

    var xAxis = d3.axisBottom(x)
      .tickValues(d3.range(0, 1441, 180))
      .tickFormat(function (mins) {
        var h = Math.floor(mins / 60);
        return (h < 10 ? '0' : '') + h + ':00';
      });
    svg.append('g').attr('class', 'agp-axis')
      .attr('transform', 'translate(0,' + height + ')').call(xAxis);

    svg.append('g').attr('class', 'agp-axis').call(d3.axisLeft(y).ticks(6));
  }
};
