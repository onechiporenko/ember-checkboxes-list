import Ember from 'ember';

const eA = Ember.A;
const set = Ember.set;
const get = Ember.get;
const on = Ember.on;
const computed = Ember.computed;

/**
 * @typedef {{
 *  label: string,
 *  value: string,
 *  isSelected: boolean,
 *  isDisabled: boolean,
 *  order: number
 * }} dropDownElement
 */
/**
 * Template for list-option
 * @type {dropDownElement}
 */
var dropDownElement = Ember.Object.extend({
  label: '',
  value: '',
  isSelected: false,
  isDisabled: false,
  order: 0
});

export default Ember.Component.extend({

  /**
   * Counter used to determine order of options selection (<code>order<code>-field in the <code>dropDownElement</code>)
   * Greater number - later selection
   * @type {number}
   */
  orderCounter: 1,

  /**
   * Maximum length of the <code>displayVal</code>
   * If its length is greater, it will cut to current value and ' ...' will be added to the end
   * @type {number}
   */
  maxDisplayValLength: 25,

  /**
   * <code>options</code> where <code>isSelected</code> is true
   * @type {dropDownElement[]}
   */
  val: eA([]),

  /**
   * List of options
   * @type {dropDownElement[]}
   */
  options: eA([]),

  /**
   * @type {{value: string, label: string, selected: boolean}}
   */
  attributes: eA([]),

  /**
   * @type {string}
   */
  identifier: '',

  /**
   * Message shown when no one option is selected
   * @type {string}
   */
  emptySelectionMessage: 'Nothing selected',

  /**
   * Determines if <code>staticDisplayVal</code> should be shown and not <code>displayVal</code>
   * @type {boolean}
   */
  useStaticDisplayVal: false,

  /**
   * Some static message shown instead of <code>displayVal</code>
   * @type {string}
   */
  staticDisplayVal: '',

  /**
   * String with selected options labels separated with ', '
   * If result string is too long (@see maxDisplayValLength) it's cut and ' ...' is added to the end
   * If nothing is selected, default placeholder is used
   * @type {string}
   */
  displayVal: computed('val.[]', function () {
    var v = get(this, 'val').sortBy('order').mapBy('label');
    if (!v.length) {
      return get(this, 'emptySelectionMessage');
    }
    var output = v.join(', ');
    var maxDisplayValLength = get(this, 'maxDisplayValLength');
    return output.length > maxDisplayValLength - 3 ? output.substring(0, maxDisplayValLength - 3) + ' ...' : output;
  }),

  /**
   * Maximum number of options allowed to select (no limits by default)
   * @type {number}
   */
  allowedToSelect: Number.POSITIVE_INFINITY,

  onInsert: on('willInsertElement', function () {
    this.calculateOptions();
    this.addObserver('options.@each.isSelected', this, this.calculateVal);
    this.addObserver('options.@each.isSelected', this, this.checkSelectedItemsCount);
    this.calculateVal();
    this.checkSelectedItemsCount();
  }),

  onDestroy: on('willDestroyElement', function() {
    this.removeObserver('options.@each.isSelected', this, this.calculateVal);
    this.removeObserver('options.@each.isSelected', this, this.checkSelectedItemsCount);
  }),

  /**
   * Get list of <code>options</code> basing on <code>attributes</code>
   * <code>dropDownElement</code> is used
   * @method calculateOptions
   */
  calculateOptions () {
    set(this, 'options', eA(get(this, 'attributes').map(entryValue => {
      return dropDownElement.create({
        value: entryValue.value,
        label: entryValue.label || entryValue.value,
        isSelected: !!entryValue.selected
      });
    })));
  },

  /**
   * Get value basing on selected <code>options</code> sorted by <code>order</code>-field
   * Triggers on each option select/deselect
   * @method calculateVal
   */
  calculateVal () {
    var filtered = get(this, 'options').filterBy('isSelected');
    set(this, 'val', eA(filtered).sortBy('order'));
  },

  /**
   * If user already selected maximum of allowed options, disable other options
   * If user deselect some option, all disabled options become enabled
   * Triggers on each option select/deselect
   * @method checkSelectedItemsCount
   */
  checkSelectedItemsCount () {
    var allowedToSelect = get(this, 'allowedToSelect');
    var currentlySelected = get(this, 'options').filterBy('isSelected').length;
    var selectionDisabled = allowedToSelect <= currentlySelected;
    eA(get(this, 'options').filterBy('isSelected', false)).setEach('isDisabled', selectionDisabled);
  },

  action: 'checkboxesListUpdate',

  actions: {

    /**
     * Option click-handler
     * toggle selection for current option and increment <code>orderCounter</code> for proper options selection order
     * @param {object} option
     */
    toggleOption (option) {
      if (get(option, 'isDisabled')) {
        return;
      }
      var orderCounter = get(this, 'orderCounter');
      var o = get(this, 'options').findBy('value', get(option, 'value'));
      set(o, 'order', orderCounter);
      o.toggleProperty('isSelected');
      this.incrementProperty('orderCounter');
      this.sendAction('action', get(this, 'identifier'), get(this, 'val'));
    }
  }
});