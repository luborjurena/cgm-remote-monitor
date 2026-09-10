'use strict';

var palette = require('./palette');
var translate = require('../language')().translate;
var d3 = (global && global.d3) || require('d3');
var textAsHtml = require('../utils/html').textAsHtml;

var calibrations = {
  name: 'calibrations'
  , label: 'Calibrations'
  , pluginType: 'report'
};

function init () {
  return calibrations;
}

module.exports = init;

calibrations.css =
  '#calibrations-layout{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;}' +
  '#calibrations-list{flex:1 1 360px;max-height:520px;overflow:auto;}' +
  '#calibrations-chart{flex:0 0 auto;max-width:100%;overflow-x:auto;}' +
  '#calibrations-list table{border-collapse:collapse;width:100%;font-size:13px;}' +
  '#calibrations-list td{padding:6px 8px;border-bottom:1px solid var(--rp-hairline);vertical-align:top;}' +
  '#calibrations-list td:first-child{white-space:nowrap;color:var(--rp-ink-3);font-size:12px;}' +
  '#calibrations-list .cal-row-mark{border-left:4px solid transparent;}';

calibrations.html = function html (client) {
  var translate = client.translate;
  var ret =
    '<h2 class="rp-h2">' + translate('Calibrations') + '</h2>' +
    '<div class="rp-card" id="calibrations-layout">' +
    '<div id="calibrations-list"></div>' +
    '<div id="calibrations-chart"></div>' +
    '</div>';
  return ret;
};

calibrations.report = function report_calibrations (datastorage, sorteddaystoshow) {
  var Nightscout = window.Nightscout;
  var report_plugins = Nightscout.report_plugins;

  var padding = { top: 15, right: 15, bottom: 30, left: 70 };
  var treatments = [];
  sorteddaystoshow.forEach(function(day) {
    treatments = treatments.concat(datastorage[day].treatments.filter(function(t) {
      if (t.eventType === 'Sensor Start') {
        return true;
      }
      if (t.eventType === 'Sensor Change') {
        return true;
      }
      return false;
    }));
  });

  var cals = [];
  sorteddaystoshow.forEach(function(day) {
    cals = cals.concat(datastorage[day].cal);
  });

  var sgvs = [];
  sorteddaystoshow.forEach(function(day) {
    sgvs = sgvs.concat(datastorage[day].sgv);
  });

  var mbgs = [];
  sorteddaystoshow.forEach(function(day) {
    mbgs = mbgs.concat(datastorage[day].mbg);
  });
  mbgs.forEach(function(mbg) { calcmbg(mbg); });

  var events = treatments.concat(cals).concat(mbgs).sort(function(a, b) { return a.mills - b.mills; });

  var colors = palette.categorical;
  var colorindex = 0;
  var html = '<table>';
  var lastmbg = null;
  for (var i = 0; i < events.length; i++) {
    var e = events[i];
    colorindex = (e.device !== undefined ? (colorindex + 1) % colors.length : colorindex);
    var currentcolor = (!e.eventType ? colors[colorindex] : 'White');

    html += '<tr>';
    html += '<td>' + report_plugins.utils.localeDateTime(new Date(e.mills)) + '</td><td class="cal-row-mark" style="border-left-color:' + (e.eventType ? 'transparent' : currentcolor) + '">';
    e.bgcolor = colors[colorindex];
    if (e.eventType) {
      html += '<b style="text-decoration: underline;padding-left:0em">' + textAsHtml(translate(e.eventType)) + '</b>:<br>';
    } else if (typeof e.device !== 'undefined') {
      html += '<input type="checkbox" index="' + i + '" class="calibrations-checkbox" id="calibrations-' + i + '"> ';
      html += '<b style="padding-left:2em">MBG</b>: ' + textAsHtml(e.y) + ' Raw: ' + textAsHtml(e.raw) + '<br>';
      lastmbg = e;
      e.cals = [];
      e.checked = false;
    } else if (typeof e.scale !== 'undefined') {
      html += '<b style="padding-left:4em">CAL</b>: ' + ' Scale: ' + e.scale.toFixed(2) + ' Intercept: ' + e.intercept.toFixed(0) + ' Slope: ' + e.slope.toFixed(2) + '<br>';
      if (lastmbg) {
        lastmbg.cals.push(e);
      }
    } else {
      html += textAsHtml(JSON.stringify(e));
    }
    html += '</td></tr>';
  }

  html += '</table>';

  $('#calibrations-list').html(html);

  // select last 3 mbgs
  checkLastCheckboxes(3);
  drawelements();

  $('.calibrations-checkbox').change(checkboxevent);

  function checkLastCheckboxes (maxcals) {
    for (i = events.length - 1; i > 0; i--) {
      if (typeof events[i].device !== 'undefined') {
        events[i].checked = true;
        $('#calibrations-' + i).prop('checked', true);
        if (--maxcals < 1) {
          break;
        }
      }
    }
  }

  function checkboxevent (event) {
    var index = $(this).attr('index');
    events[index].checked = $(this).is(':checked');
    drawelements();
    event.preventDefault();
  }

  function drawelements () {
    drawChart();
    for (var i = 0; i < events.length; i++) {
      e = events[i];
      if (e.checked) {
        drawmbg(e);
        e.cals.forEach(drawcal);
      }
    }
  }

  var calibration_context, xScale2, yScale2;

  function drawChart () {
    var maxBG = 500;

    $('#calibrations-chart').empty();
    var charts = d3.select('#calibrations-chart').append('svg');

    charts.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', '#ffffff');

    calibration_context = charts.append('g');

    // define the parts of the axis that aren't dependent on width or height
    xScale2 = d3.scaleLinear()
      .domain([0, maxBG]);

    yScale2 = d3.scaleLinear()
      .domain([0, 400000]);

    var xAxis2 = d3.axisBottom(xScale2)
      .ticks(10);

    var yAxis2 = d3.axisLeft(yScale2);

    // get current data range
    var dataRange = [0, maxBG];
    var width = 600;
    var height = 500;

    // get the entire container height and width subtracting the padding
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    //set the width and height of the SVG element
    charts.attr('width', width)
      .attr('height', height);

    // ranges are based on the width and height available so reset
    xScale2.range([0, chartWidth]);
    yScale2.range([chartHeight, 0]);

    // create the x axis container
    calibration_context.append('g')
      .attr('class', 'x axis');

    // create the y axis container
    calibration_context.append('g')
      .attr('class', 'y axis');

    calibration_context.select('.y')
      .attr('transform', 'translate(' + ( /*chartWidth + */ padding.left) + ',' + padding.top + ')')
      .call(yAxis2);

    // if first run then just display axis with no transition
    calibration_context.select('.x')
      .attr('transform', 'translate(' + padding.left + ',' + (chartHeight + padding.top) + ')')
      .call(xAxis2);

    [50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000].forEach(function(li) {
      calibration_context.append('line')
        .attr('class', 'high-line')
        .attr('x1', xScale2(dataRange[0]) + padding.left)
        .attr('y1', yScale2(li) + padding.top)
        .attr('x2', xScale2(dataRange[1]) + padding.left)
        .attr('y2', yScale2(li) + padding.top)
        .style('stroke-dasharray', ('3, 3'))
        .attr('stroke', '#e6ebf0');
    });
    [50, 100, 150, 200, 250, 300, 350, 400, 450, 500].forEach(function(li) {
      calibration_context.append('line')
        .attr('class', 'high-line')
        .attr('x1', xScale2(li) + padding.left)
        .attr('y1', padding.top)
        .attr('x2', xScale2(li) + padding.left)
        .attr('y2', chartHeight + padding.top)
        .style('stroke-dasharray', ('3, 3'))
        .attr('stroke', '#e6ebf0');
    });
  }

  function drawcal (cal) {
    var color = cal.bgcolor;
    var y1 = 50000;
    var x1 = cal.scale * (y1 - cal.intercept) / cal.slope;
    var y2 = 400000;
    var x2 = cal.scale * (y2 - cal.intercept) / cal.slope;
    calibration_context.append('line')
      .attr('x1', xScale2(x1) + padding.left)
      .attr('y1', yScale2(y1) + padding.top)
      .attr('x2', xScale2(x2) + padding.left)
      .attr('y2', yScale2(y2) + padding.top)
      .style('stroke-width', 2)
      .attr('stroke', color);
  }

  function calcmbg (mbg) {
    var lastsgv = findlatest(new Date(mbg.mills), sgvs);

    if (lastsgv) {
      if (mbg.mills - lastsgv.mills > 5 * 60 * 1000) {
        console.log('Last SGV too old for MBG. Time diff: ' + ((mbg.mills - lastsgv.mills) / 1000 / 60).toFixed(1) + ' min', mbg);
      } else {
        mbg.raw = lastsgv.filtered || lastsgv.unfiltered;
      }
    } else {
      console.log('Last entry not found for MBG ', mbg);
    }
  }

  function drawmbg (mbg) {
    var color = mbg.bgcolor;
    if (mbg.raw) {
      calibration_context.append('circle')
        .attr('cx', xScale2(mbg.y) + padding.left)
        .attr('cy', yScale2(mbg.raw) + padding.top)
        .attr('fill', color)
        .style('opacity', 1)
        .attr('stroke-width', 2)
        .attr('stroke', '#ffffff')
        .attr('r', 5.5);
    }
  }

  function findlatest (date, storage) {
    var last = null;
    var time = date.getTime();
    for (var i = 0; i < storage.length; i++) {
      if (storage[i].mills > time) {
        return last;
      }
      last = storage[i];
    }
    return last;
  }
};
