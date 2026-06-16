'use strict';

// Time in Range / Time in Tight Range pill for the main page.
// Computes TIR (70-180 mg/dL = 3.9-10.0 mmol/L) and TITR (70-140 = 3.9-7.8)
// over the last N days by fetching SGV entries from the API on the client.

function init (ctx) {
  var translate = ctx.language.translate;

  var tir = {
    name: 'tir'
    , label: 'Time in Range (7 days)'
    , pluginType: 'pill-minor'
  };

  var DAYS = 7;
  var MS_PER_DAY = 24 * 60 * 60 * 1000;
  var REFRESH_MS = 5 * 60 * 1000; // refetch at most every 5 minutes

  // client-only cache (the pill renders on the client)
  var state = {
    loading: false
    , lastFetch: 0
    , tir: null
    , titr: null
    , count: 0
  };

  function computeFromEntries (entries) {
    var total = 0;
    var inRange = 0;
    var tight = 0;
    for (var i = 0; i < entries.length; i++) {
      var sgv = entries[i] && entries[i].sgv;
      if (typeof sgv !== 'number' || sgv < 39) continue;
      total++;
      if (sgv >= 70 && sgv <= 180) inRange++;
      if (sgv >= 70 && sgv <= 140) tight++;
    }
    state.count = total;
    state.tir = total > 0 ? (100 * inRange / total) : null;
    state.titr = total > 0 ? (100 * tight / total) : null;
  }

  function maybeFetch (sbx) {
    if (typeof window === 'undefined' || !window.$) return; // client only
    var now = Date.now();
    if (state.loading || (now - state.lastFetch) < REFRESH_MS) return;

    var client = window.Nightscout && window.Nightscout.client;
    state.loading = true;
    state.lastFetch = now;

    var from = now - DAYS * MS_PER_DAY;
    var url = '/api/v1/entries/sgv.json?find[date][$gte]=' + from + '&count=25000';

    window.$.ajax(url, {
      headers: client && client.headers ? client.headers() : {}
    }).done(function (records) {
      computeFromEntries(records || []);
    }).fail(function () {
      // keep previous values; allow another attempt on next cycle
    }).always(function () {
      state.loading = false;
      if (sbx && sbx.pluginBase) tir.updateVisualisation(sbx);
    });
  }

  tir.updateVisualisation = function updateVisualisation (sbx) {
    maybeFetch(sbx);

    var client = (typeof window !== 'undefined') && window.Nightscout && window.Nightscout.client;
    var units = (client && client.settings && client.settings.units)
      || (sbx.settings && sbx.settings.units) || 'mg/dl';
    var isMmol = units === 'mmol';
    var rangeLabel = isMmol ? '3.9–10.0 mmol/L' : '70–180 mg/dL';
    var tightLabel = isMmol ? '3.9–7.8 mmol/L' : '70–140 mg/dL';

    var value;
    var info;
    var pillClass = null;

    if (state.tir == null) {
      value = '--';
      info = [{ label: translate('Time in Range'), value: state.loading ? translate('Loading...') : 'n/a' }];
    } else {
      value = Math.round(state.tir) + '% / ' + Math.round(state.titr) + '%';
      pillClass = state.tir >= 70 ? null : 'warn';
      info = [
        { label: 'TIR (' + rangeLabel + ')', value: state.tir.toFixed(1) + '%' }
        , { label: 'TITR (' + tightLabel + ')', value: state.titr.toFixed(1) + '%' }
        , { label: translate('Readings'), value: state.count }
        , { label: translate('Period'), value: DAYS + ' ' + translate('days') }
      ];
    }

    sbx.pluginBase.updatePillText(tir, {
      value: value
      , label: 'TIR/TITR ' + DAYS + 'd'
      , info: info
      , pillClass: pillClass
    });
  };

  return tir;
}

module.exports = init;
