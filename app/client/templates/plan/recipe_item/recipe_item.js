/*****************************************************************************/
/* RecipeItem: Event Handlers */
/*****************************************************************************/
Template.RecipeItem.events({
});

/*****************************************************************************/
/* RecipeItem: Helpers */
/*****************************************************************************/
Template.RecipeItem.helpers({
	planPage:function(param1, param2){
		var page = Session.get('planPage');
		if (page == param1 || page == param2) {
			return true
		} else {
			return false
		}
	}
});

/*****************************************************************************/
/* RecipeItem: Lifecycle Hooks */
/*****************************************************************************/
Template.RecipeItem.onCreated(function () {
});

Template.RecipeItem.onRendered(function () {
});

Template.RecipeItem.onDestroyed(function () {
});
