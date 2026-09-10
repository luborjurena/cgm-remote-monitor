'use strict';

// Single source of truth for every data color the report plugins draw with.
//
// The sets below were validated with the dataviz six checks (OKLCH lightness
// band, chroma floor, CVD separation under protan/deutan simulation, the
// normal-vision floor and contrast) against the white card surface. Keep the
// slot order of the categorical lists fixed: the order is what keeps adjacent
// series apart for colour-blind readers.
var palette = {
  // Glucose status tiers. Fixed meaning, always shown next to a label.
  tiers: {
    veryLow: '#a32020'
    , low: '#e34948'
    , inRange: '#008300'
    , high: '#eda100'
    , veryHigh: '#d95926'
  }

  // Treatment marks.
  , insulin: '#2a78d6'
  , carbs: '#eb6834'
  , basal: '#5598e7'
  , median: '#1c5cab'
  , bandInner: '#6da7ec'
  , bandOuter: '#b7d3f6'
  , targetBand: 'rgba(0,131,0,0.10)'
  , event: '#4a3aa7'
  , exercise: '#1baf7a'
  , offline: '#e87ba4'
  , mbg: '#e34948'
  , raw: '#c5ced6'

  // Categorical slots in fixed order; never generate a 9th.
  , categorical: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']
  // Weekday identity, Sunday first so it indexes by Date#getDay().
  , weekday: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7']

  // Chart furniture.
  , ink: '#23303d'
  , inkSecondary: '#5b6b7a'
  , inkMuted: '#66788a'
  , grid: '#e6ebf0'
  , hairline: '#eef2f6'
  , axis: '#c5ced6'
  , surface: '#ffffff'
  , tint: '#f7f9fb'
};

// Same values as CSS custom properties, injected once by the plugin loader so
// plugin stylesheets and report.css draw from the same numbers.
palette.css = ':root{' +
  '--rp-very-low:' + palette.tiers.veryLow + ';' +
  '--rp-low:' + palette.tiers.low + ';' +
  '--rp-in-range:' + palette.tiers.inRange + ';' +
  '--rp-high:' + palette.tiers.high + ';' +
  '--rp-very-high:' + palette.tiers.veryHigh + ';' +
  '--rp-insulin:' + palette.insulin + ';' +
  '--rp-carbs:' + palette.carbs + ';' +
  '--rp-basal:' + palette.basal + ';' +
  '--rp-median:' + palette.median + ';' +
  '--rp-band-inner:' + palette.bandInner + ';' +
  '--rp-band-outer:' + palette.bandOuter + ';' +
  '--rp-target-band:' + palette.targetBand + ';' +
  '--rp-event:' + palette.event + ';' +
  '}';

module.exports = palette;
