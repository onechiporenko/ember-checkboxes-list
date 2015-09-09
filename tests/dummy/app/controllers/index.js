import Ember from 'ember';

var eA = Ember.A;

export default Ember.Controller.extend({

  example1Value: '1st, 3rd',

  example1FieldName: 'example1Value',

  example1Attributes: eA([
    { value: '1st', label: 'First', selected: true },
    { value: '2nd', label: 'Second' },
    { value: '3rd', label: 'Third' },
    { value: '4th', label: 'Fourth', selected: true }
  ]),

  example2Value: '',

  example2FieldName: 'example2Value',

  example2EmptySelectionMessage: 'Select something, dude!',

  example2Attributes: eA([
    { value: '1st', label: 'First' },
    { value: '2nd', label: 'Second' },
    { value: '3rd', label: 'Third' },
    { value: '4th', label: 'Fourth' }
  ]),

  example3Value: '',

  example3FieldName: 'example3Value',

  example3AllowedToSelect: 3,

  example3Attributes: eA([
    { value: '1st', label: 'First' },
    { value: '2nd', label: 'Second' },
    { value: '3rd', label: 'Third' },
    { value: '4th', label: 'Fourth' }
  ]),

  example4Value: '',

  example4StaticDisplayVal: 'Some static text',

  example4FieldName: 'example4Value',

  example4Attributes: eA([
    { value: '1st', label: 'First', selected: true },
    { value: '2nd', label: 'Second', selected: true },
    { value: '3rd', label: 'Third' },
    { value: '4th', label: 'Fourth' }
  ]),

  actions: {
    checkboxesListUpdate (fieldName, value) {
      this.set(fieldName, value.mapBy('value').join(', '));
    }
  }

});