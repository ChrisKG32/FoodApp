/*****************************************************************************/
/* EditIngredients: Event Handlers */
/*****************************************************************************/
Template.EditIngredients.events({
	'keyup #ingredient-name':function(e){
		var searchValue = $('#ingredient-name').val();
		Session.set('ingredientSearch', searchValue);
	},
	'click .search-item':function(e){
		var currentTarget = $(e.currentTarget);
		var currentIngredient = this;
		
		console.log(currentIngredient);
		Session.set('selectedIngredient', currentIngredient);
	},
	'click input[type="checkbox"]':function(e){
		var currentTarget = $(e.currentTarget);
		var textField = currentTarget.next();
		if (currentTarget.is(':checked')) {
			console.log('derp');
			textField.removeAttr('disabled');
		} else {
			textField.prop('disabled', true);
		}
	},
	'click .submit-changes':function(e){
		var newName = $('.ingredient-name').val();
		var newAisle = $('.ingredient-aisle').val();
		var newMeasurement = $('.ingredient-measurement').val();

		var origName = this.name;
		var origAisle = this.aisle;
		var origMeasurement = this.measurement;

		if (newName != origName || newAisle != origAisle || newMeasurement != origMeasurement) {
			var data = this;
			data.name = newName;
			data.aisle = newAisle;
			data.measurement = newMeasurement;

			Meteor.call('updateIngredient', data);
		} else {
			console.log('no changes');
		}
	},
	'click .cancel-changes':function(e){
		Session.set('selectedIngredient', false);
		Session.set('ingredientSearch', []);
	}
});

/*****************************************************************************/
/* EditIngredients: Helpers */
/*****************************************************************************/
Template.EditIngredients.helpers({
	searchResults:function(){
		var searchValue = Session.get('ingredientSearch');

	

		if ((searchValue && searchValue.length) > 2) {
			var dbResults = Ingredients.find({name: {$regex: '^' + searchValue + '.*'}}, {limit: 10}).fetch();

		} 

		if (dbResults && dbResults.length > 0) {
			return dbResults
		} else {
			return []
		}
	},
	editPage:function(param1) {
		var selectedIngredient = Session.get('selectedIngredient');
		if (selectedIngredient) {
			return selectedIngredient
		} else {
			return false
		}
	}
});

/*****************************************************************************/
/* EditIngredients: Lifecycle Hooks */
/*****************************************************************************/
Template.EditIngredients.onCreated(function () {
});

Template.EditIngredients.onRendered(function () {
	Session.set('selectedIngredient', false);
	Session.set('ingredientSearch', []);
});

Template.EditIngredients.onDestroyed(function () {
});
