/*****************************************************************************/
/* MiniNav: Event Handlers */
/*****************************************************************************/
Template.MiniNav.events({
	'click .meal-plan-button':function(e){
		Session.set('planPage', 'Meal Plan');
	},
	'click .your-recipes-button':function(e){
		Session.set('planPage', 'Your Recipes');
	},
	'click .search-recipes-button':function(e){
		Session.set('planPage', 'Search Recipes');
	},
	'click .section-select':function(e){
		$('.mini-nav-dropdown').toggle();
	},
	'click .mini-nav-dropdown li':function(e){
		$('.mini-nav-dropdown').toggle();
	}
});

/*****************************************************************************/
/* MiniNav: Helpers */
/*****************************************************************************/
Template.MiniNav.helpers({
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
/* MiniNav: Lifecycle Hooks */
/*****************************************************************************/
Template.MiniNav.onCreated(function () {
});

Template.MiniNav.onRendered(function () {
});

Template.MiniNav.onDestroyed(function () {
});
