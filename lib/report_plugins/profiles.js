'use strict';

var textAsHtml = require('../utils/html').textAsHtml;
var toTextContent = require('../utils/html').toTextContent;

var profiles = {
  name: 'profiles'
  , label: 'Profiles'
  , pluginType: 'report'
};

function init () {
  return profiles;
}

module.exports = init;

profiles.html = function html (client) {
  var translate = client.translate;
  var ret =
    '<h2 class="rp-h2">' + translate('Profiles') + '</h2>' +
    '<div class="rp-card"><div class="rp-options">' +
    '<label><span class="rp-options-title">' + translate('Database records') + '</span>' +
    '<select id="profiles-databaserecords"></select></label>' +
    '<span class="rp-muted" id="profiles-default"></span>' +
    '</div></div>' +
    '<div id="profiles-chart" class="rp-row">' +
    '</div>';
  return ret;
};

profiles.css =
  '.rp-profile{flex:0 1 380px;}' +
  '.rp-profile-table td{padding:5px 0;line-height:1.5;}' +
  '.rp-profile-table tr:first-child td{font-size:15px;}';

profiles.report = function report_profiles (datastorage) {
  var Nightscout = window.Nightscout;
  var client = Nightscout.client;
  var translate = client.translate;
  var moment = window.moment;
  var profile = client.sbx.data.profile;

  var profileRecords = datastorage.profiles;
  var databaseRecords = $('#profiles-databaserecords');

  databaseRecords.empty();
  for (var r = 0; r < profileRecords.length; r++) {
    databaseRecords.append('<option value="' + r + '">' + translate('Valid from:') + ' ' + profile.applyTimezone(moment(profileRecords[r].startDate)).format('L LT') + '</option>');
  }
  databaseRecords.unbind().bind('change', recordChange);

  recordChange();

  function recordChange (event) {
    if ($('#profiles-databaserecords option').length < 1)
      return;
    var currentindex = databaseRecords.val();
    var currentrecord = profileRecords[currentindex];

    var chart = $('#profiles-chart').empty();

    $('#profiles-default').text(toTextContent(currentrecord.defaultProfile));

    Object.keys(currentrecord.store).forEach(key => {
      chart.append(displayRecord(currentrecord.store[key], key));
    });

    if (event) {
      event.preventDefault();
    }
  }

  function displayRecord (record, name) {
    var td = $('<div class="rp-card rp-profile">');
    var table = $('<table class="rp-table rp-table-left rp-profile-table">');

    table.append($('<tr>').append($('<td>').append('<b>' + textAsHtml(name) + '</b>')));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('Units') + '</b>:&nbsp' + textAsHtml(record.units))));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('DIA') + '</b>:&nbsp' + textAsHtml(record.dia))));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('Timezone') + '</b>:&nbsp' + textAsHtml(record.timezone))));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('Carbs activity / absorption rate') + '</b>:&nbsp' + textAsHtml(record.carbs_hr))));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('Insulin to carb ratio (I:C)') + '</b>:&nbsp' + '<br>' + displayRanges(record.carbratio))));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('Insulin Sensitivity Factor (ISF)') + '</b>:&nbsp' + '<br>' + displayRanges(record.sens))));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('Basal rates [unit/hour]') + '</b>:&nbsp' + '<br>' + displayRanges(record.basal))));
    table.append($('<tr>').append($('<td>').append('<b>' + translate('Target BG range [mg/dL,mmol/L]') + '</b>:&nbsp' + '<br>' + displayRanges(record.target_low, record.target_high))));

    td.append(table);
    return td;
  }

  function displayRanges (array, array2) {
    var text = '';

    if (array && array2) {
      for (let i = 0; i < array.length; i++) {
        text += textAsHtml(array[i].time) + '&nbsp:&nbsp' + textAsHtml(array[i].value) + (array2 ? ' - ' + textAsHtml(array2[i].value) : '') + '<br>';
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        text += textAsHtml(array[i].time) + '&nbsp:&nbsp' + textAsHtml(array[i].value)  + '<br>';
      }
    }
    return text;
  }
};
