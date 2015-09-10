import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

const eA = Ember.A;

moduleForComponent('checkboxes-list', 'CheckboxesList', {});

var selectors = {
  dropdownLink: 'a.dropdown-toggle',
  option: i => `.dropdown-menu li:nth-child(${i}) a`,
  optionIcon: i => `.dropdown-menu li:nth-child(${i}) a span`,
  options: '.dropdown-menu li a',
  optionsIcons: '.dropdown-menu li a span',
  checkedOptionClass: 'glyphicon-check',
  uncheckedOptionClass: 'glyphicon-unchecked'
};

test('basic render', function (assert) {

  this.subject({
    attributes: eA([
      { value: '1st', label: 'First', selected: true },
      { value: '2nd', label: 'Second' },
      { value: '3rd', label: 'Third' },
      { value: '4th', label: 'Fourth', selected: true }
    ])
  });

  this.render();

  assert.equal(this.$().find(selectors.dropdownLink).text().trim(), 'First, Fourth', 'Valid `displayVal` is shown');
  assert.ok(this.$().find(selectors.optionIcon(1)).hasClass(selectors.checkedOptionClass), '1st option is selected');
  assert.ok(this.$().find(selectors.optionIcon(4)).hasClass(selectors.checkedOptionClass), '4th option is selected');
  assert.ok(this.$().find(selectors.optionIcon(2)).hasClass(selectors.uncheckedOptionClass), '2nd option is not selected');
  assert.ok(this.$().find(selectors.optionIcon(3)).hasClass(selectors.uncheckedOptionClass), '3rd option is not selected');

  this.$().find(selectors.option(1)).click();
  this.$().find(selectors.option(4)).click();

  assert.equal(this.$().find(selectors.optionsIcons + '.' + selectors.uncheckedOptionClass).length, 4, 'All options are deselected');
  assert.equal(this.$().find(selectors.dropdownLink).text().trim(), 'Nothing selected', '`emptySelectionMessage` is shown');

});

test('emptySelectionMessage', function (assert) {

  this.subject({
    emptySelectionMessage: 'Select something, dude!',
    attributes: eA([
      { value: '1st', label: 'First'}
    ])
  });

  this.render();
  assert.equal(this.$().find(selectors.dropdownLink).text().trim(), 'Select something, dude!', 'Custom `emptySelectionMessage` is shown');

});

test('allowedToSelect', function (assert) {

  this.subject({
    allowedToSelect: 3,
    attributes: eA([
      { value: '1st', label: 'First', selected: true },
      { value: '2nd', label: 'Second' },
      { value: '3rd', label: 'Third' },
      { value: '4th', label: 'Fourth', selected: true }
    ])
  });

  this.render();

  assert.equal(this.$().find(selectors.options + '.disabled').length, 0, 'All options are enabled');
  this.$().find(selectors.option(3)).click();
  assert.equal(this.$().find(selectors.optionsIcons + '.' + selectors.checkedOptionClass).length, 3, '3 options are selected');
  assert.ok(this.$().find(selectors.option(2) + '.disabled'), '2nd option is disabled');

  this.$().find(selectors.option(1)).click();

  assert.equal(this.$().find(selectors.options + '.disabled').length, 0, 'All options are enabled');

});

test('staticDisplayVal', function (assert) {

  this.subject({
    staticDisplayVal: 'Some static text',
    useStaticDisplayVal: true,
    attributes: eA([
      { value: '1st', label: 'First', selected: true },
      { value: '2nd', label: 'Second' },
      { value: '3rd', label: 'Third' },
      { value: '4th', label: 'Fourth' }
    ])
  });

  this.render();

  assert.equal(this.$().find(selectors.dropdownLink).text().trim(), 'Some static text', '`staticDisplayVal` is shown when something is selected');
  this.$().find(selectors.option(1)).click();
  assert.equal(this.$().find(selectors.dropdownLink).text().trim(), 'Some static text', '`staticDisplayVal` is shown when nothing is selected');

});

test('check selection order', function (assert) {

  var component = this.subject({
    staticDisplayVal: 'Some static text',
    useStaticDisplayVal: true,
    attributes: eA([
      { value: '1st', label: 'First', selected: true },
      { value: '2nd', label: 'Second' },
      { value: '3rd', label: 'Third' },
      { value: '4th', label: 'Fourth' }
    ])
  });

  this.render();
  assert.deepEqual(component.get('val').mapBy('value'), ['1st'], 'Init value is valid');
  this.$().find(selectors.option(2)).click();
  assert.deepEqual(component.get('val').mapBy('value'), ['1st', '2nd'], 'Value is valid after 2nd option becomes selected');
  this.$().find(selectors.option(3)).click();
  assert.deepEqual(component.get('val').mapBy('value'), ['1st', '2nd', '3rd'], 'Value is valid after 3rd option becomes selected');
  this.$().find(selectors.option(1)).click();
  assert.deepEqual(component.get('val').mapBy('value'), ['2nd', '3rd'], 'Value is valid after 1st option becomes deselected');
  this.$().find(selectors.option(1)).click();
  assert.deepEqual(component.get('val').mapBy('value'), ['2nd', '3rd', '1st'], 'Value is valid after 1st option becomes selected');
});

test('toggleOption', function (assert) {

  var targetObject = {
    customAction: function() {
      var fieldName = arguments[0];
      var value = arguments[1];
      assert.equal(fieldName, 'uid', '1st parameter in the callback is fieldName');
      assert.deepEqual(eA(value).mapBy('value'), ['1st', '3rd', '2nd'], '2nd parameter in the callback is value');
    }
  };

  var component = this.subject({
    targetObject: targetObject,
    action: 'customAction',
    identifier: 'uid',
    attributes: eA([
      { value: '1st', label: 'First', selected: true },
      { value: '2nd', label: 'Second' },
      { value: '3rd', label: 'Third', selected: true },
      { value: '4th', label: 'Fourth' }
    ])
  });

  this.render();
  this.$().find(selectors.option(2)).click();
  assert.deepEqual(component.get('val').mapBy('value'), ['1st', '3rd', '2nd']);

});
