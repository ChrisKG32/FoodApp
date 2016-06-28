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
	},
	favorited:function(){
		var currentUser = Meteor.userId();
		var userAccount = Meteor.users && Meteor.users.findOne(currentUser);
		var userFavorites = userAccount && userAccount.profile && userAccount.profile.favorites;
		var recipeId = this._id;

		var matchingRecipe = Meteor.users && Meteor.users.find({_id: currentUser, 'profile.favorites': recipeId }).fetch();
		if (matchingRecipe.length > 0) {
			return 'yes'
		} else {
			return ''
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
