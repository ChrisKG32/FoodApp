/*****************************************************************************/
/* Recipes: Event Handlers */
/*****************************************************************************/
Template.Recipes.events({
	'click .recipe-share':function(e){
		var currentUser = Meteor.userId();
		var recipeId = this._id;
		var userProfile = Meteor.users.findOne(currentUser);
		var userFavorites = userProfile && userProfile.profile && userProfile.profile.favorites;
		var conflicts = false;
		for (var i in userFavorites) {
			if (userFavorites[i] === recipeId) {
				conflicts = true;
				break
			}
		}
		if (conflicts) {
			console.log('you already favorited this');
		} else {
			console.log('you just favorited this recipe');
			Meteor.users.update(currentUser, {$push: {"profile.favorites": this._id}})
		}
	},
	'scroll .recipes':function(){
		var recipeItemHeight = $('.recipe-item').height() * 4;
		var scrollDistance = $('.recipes').scrollTop();
		if (scrollDistance > breakpoint) {

			var newLimit = Session.get('recipeLimit') + 8;
			Session.set('recipeLimit', newLimit);
			breakpoint += recipeItemHeight;
		}

	}
});

/*****************************************************************************/
/* Recipes: Helpers */
/*****************************************************************************/
Template.Recipes.helpers({
	//Renders recipes on in Recipe template
	'displayRecipes':function(param1, param2){
		var planPage = Session.get('planPage');
		var recipeLimit = Session.get('recipeLimit');
		var recipesList = Recipes.find({},{limit: recipeLimit}).fetch();
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile;
		var userRecipes = userProfile && userProfile.favorites;

		var data = [];
		_.each(userRecipes, function(recipeId){
			if (recipeId != undefined) {
				data.push(Recipes.findOne({_id: recipeId}));
			}
		});

		if (planPage == param2) {
			return recipesList
		} else if (planPage == param1) {
			return data
		} else {
			return false
		}
	},
	planPage:function(param1){
		var planPage = Session.get('planPage');
		if (planPage == param1) {
			return true
		} else {
			return false
		}
	},
	filterItems:function(){
		var filterItems = [];
		if (filterItems.length < 1) {
			return false
		} else {
			return filterItems
		}
	}
});

/*****************************************************************************/
/* Recipes: Lifecycle Hooks */
/*****************************************************************************/
Template.Recipes.onCreated(function () {
});

Template.Recipes.onRendered(function () {
	//Set how many recipes render
	Session.set('recipeLimit', 20);	
	breakpoint = 600;

	//Sidebar and sidebar button positioning/sizing
		var sidebarEl = $('.filter-sidebar');
		var swipeBtnEl = $('#swipe-btn');
		if (sidebarEl && swipeBtnEl) {
			var viewportPx = $(window).width();

			//Sets sidebar width (different for Recipes page and Meal Plan page)
			var newSidebarSize = viewportPx * 0.85;

			//Removes transitions for resizing
			sidebarEl.css('transition', '');
			swipeBtnEl.css('transition', '');

			//Sets width and moves sidebar out of view
			sidebarEl.css('width', newSidebarSize + 'px');
			sidebarEl.css({
				transform: 'translate(-' + newSidebarSize + 'px)'
			});
			//Moves button to far left
			swipeBtnEl.css({
				transform: 'translate(0px)'
			});
		}
});

Template.Recipes.onDestroyed(function () {
});
