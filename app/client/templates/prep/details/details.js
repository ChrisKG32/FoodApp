/*****************************************************************************/
/* Details: Event Handlers */
/*****************************************************************************/
Template.Details.events({
	'click .dropdown-tab':function(e){
		e.preventDefault();
		var $target = $(e.target);
		if ($target.hasClass('instruction-tab')) {
			Session.set('tab', true);
		} else if ($target.hasClass('ingredient-tab')) {
			Session.set('tab', false);
		}
	}
});

/*****************************************************************************/
/* Details: Helpers */
/*****************************************************************************/
Template.Details.helpers({
	currentTab:function(){
		var currentTab = Session.get('tab');
		if (currentTab === true) {
			return true
		} else {
			return false
		}
	},
	currentRecipe:function(){
		var recipeId = Session.get('currentRecipe');
		var currentRecipe = Recipes.findOne({_id: recipeId});
		return currentRecipe
	}
});

/*****************************************************************************/
/* Details: Lifecycle Hooks */
/*****************************************************************************/
Template.Details.onCreated(function () {
});

Template.Details.onRendered(function () {
});

Template.Details.onDestroyed(function () {
});
