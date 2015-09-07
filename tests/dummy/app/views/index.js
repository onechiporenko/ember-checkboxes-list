/* global Prism */
import Ember from 'ember';

export default Ember.View.extend({

  onInsert: Ember.on('didInsertElement', function () {
    Ember.run.next(function () {
      Prism.highlightAll();
    });
  })

});