/*****************************************************************************/
/* IngredientItem: Event Handlers */
/*****************************************************************************/
Template.IngredientItem.events({
});

/*****************************************************************************/
/* IngredientItem: Helpers */
/*****************************************************************************/
Template.IngredientItem.helpers({
	autocomplete:function(){
		var autocompleteResults = Session.get('autocomplete');

		if (autocompleteResults.length > 0) {
			return autocompleteResults
		} else {
			return []
		}
	},
	itemNumber:function(){
		var mySession = Session.get('something');
		return mySession
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
