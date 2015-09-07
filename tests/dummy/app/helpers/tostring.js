import Ember from 'ember';

export function tostring(params/*, hash*/) {
  let shown = params[0];
  if ('function' === Ember.typeOf(shown)) {
    return shown.toString().replace(/Ember\['default'\]/g, 'Ember');
  }
  return JSON.stringify(shown, null, 2);
}

export default Ember.Helper.helper(tostring);
