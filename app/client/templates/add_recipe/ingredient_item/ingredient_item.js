/*****************************************************************************/
/* IngredientItem: Event Handlers */
/*****************************************************************************/
Template.IngredientItem.events({
	'click .cancel-new-db':function(e){
		Session.set('newIngredientInput', false);
	},

	'click .submit-new-db':function(e){
		e.preventDefault();
		var currentTarget = $(e.currentTarget);
		var number = Session.get('newIngredientInput');
		var name = $('#new-db-name-' + number).val();
		var aisle = $('#new-db-aisle-' + number).val();
		var measurement = $('#new-db-measurement-' + number).val();
		var recipeCB = $('#new-db-cb-recipe-' + number).is(':checked');
		var videoCB = $('#new-db-cb-video-' + number).is(':checked');

		var currentUser = Meteor.userId();

		if (name && aisle && measurement){

			var conflict = Ingredients.findOne({$and: [{name: name}, {measurement: measurement}]});

			if (!conflict){

				var data = {
					name: name,
					aisle: aisle,
					measurement: measurement,
					recipe: recipeCB,
					video: videoCB,
					createdBy: currentUser
				}
				//Meteor.call('newIngredient', data);
				console.log(data);

				Session.set('newIngredientInput', false);
				$('#ingredient-name-' + number).val('');
			}
		}
	}
});

/*****************************************************************************/
/* IngredientItem: Helpers */
/*****************************************************************************/
Template.IngredientItem.helpers({
	autocomplete:function(){
		var autocompleteResults = Session.get('autocomplete');
		var thisNumber = this.number;
		var thisElement = $('#ingredient-name-' + thisNumber);


		if ((autocompleteResults && autocompleteResults.length > 0) && (thisElement.is(':focus'))) {
			return autocompleteResults
		} else {
			return []
		}
	},
	itemNumber:function(){
		var mySession = Session.get('something');
		var numberIngredients = $('.ingredient-item');
		return numberIngredients && numberIngredients.length
	},
	newIngredient:function(){
		var everyKey = Session.get('everyKey');
		var autocompleteResults = Session.get('autocomplete');
		var thisNumber = this.number;
		var thisElement = $('#ingredient-name-' + thisNumber);


		if (autocompleteResults){
			if ((autocompleteResults && autocompleteResults.length < 1) && 
				(thisElement.is(':focus')) && 
				(thisElement.val().length > 2)) {

				return true
			} else {
				return false
			}
		} else {
			if ((thisElement.is(':focus')) && 
				(thisElement.val().length > 2)) {

				return true
			} else {
				return false
			}
		}
	},
	newIngredientInput:function(){
		var newInput = Session.get('newIngredientInput');
		var number = this.number;

		if (newInput && newInput == this.number) {
			return true
		} else {
			return false
		}
	}
});

/*****************************************************************************/
/* IngredientItem: Lifecycle Hooks */
/*****************************************************************************/
Template.IngredientItem.onCreated(function () {
});

Template.IngredientItem.onRendered(function () {
	var mySession = Session.get('something');
	mySession++
	Session.set('something', mySession);

});

Template.IngredientItem.onDestroyed(function () {
});
