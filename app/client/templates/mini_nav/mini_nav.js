/*****************************************************************************/
/* MiniNav: Event Handlers */
/*****************************************************************************/
Template.MiniNav.events({
	'click .section-select':function(e){
		$('.mini-nav-dropdown').toggle();
	},
	'click .mini-nav-dropdown li':function(e){
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);

		$('.mini-nav-dropdown').toggle();

		if (currentTarget.hasClass('meal-plan-button')){
			Session.set('planPage', 'Meal Plan');
		} else if (currentTarget.hasClass('your-recipes-button')) {
			Session.set('planPage', 'Your Recipes');
		} else if (currentTarget.hasClass('search-recipes-button')) {
			Session.set('planPage', 'Search Recipes');
		} else if (currentTarget.hasClass('single-day-prep')){
			Session.set('prepPage', 'Single Day');
		} else if (currentTarget.hasClass('week-prep')) {
			Session.set('prepPage', 'Week');
		}
	}
});

/*****************************************************************************/
/* MiniNav: Helpers */
/*****************************************************************************/
Template.MiniNav.helpers({
	planPage:function(param1, param2, param3){
		var page = Session.get('planPage');
		if (page == param1 || page == param2 || page == param3) {
			return true
		} else {
			return false
		}
	},
	prepPage:function(param1, param2){
		var routeName = Router.current() && Router.current().route && Router.current().route.getName();
		var prepPage = Session.get('prepPage');

		if (routeName === 'prep' && param1 == prepPage){
			return true
		} else if (param1 == 'Single Day' && param2 == 'Week') {
			return true
		} else {
			return false
		}
	},
	shopPage:function(param1){
		var routeName = Router.current() && Router.current().route && Router.current().route.getName();
		var shopPage = Session.get('shopPage');

		if (param1 == 'Smart List'){
			return true
		} else {
			return false
		}
	},
	headers:function(param1, param2, param3){
		var routeName = Router.current() && Router.current().route && Router.current().route.getName();
		var planPage = Session.get('planPage');
		var shopPage = Session.get('shopPage');
		var prepPage = Session.get('prepPage');
		if (routeName === 'plan') {
			return planPage
		} else if (routeName === 'shop') {
			return shopPage
		} else if (routeName = 'prep') {
			return prepPage
		}
	},
	dropdowns:function(){
		var routeName = Router.current() && Router.current().route && Router.current().route.getName();
		var planPage = Session.get('planPage');
		var shopPage = Session.get('shopPage');
		var prepPage = Session.get('prepPage');

		if (routeName === 'plan') {
			var planDropdown = [
				{name: 'Search Recipes', class: 'search-recipes-button'},
				{name: 'Your Recipes', class: 'your-recipes-button'},
				{name: 'Meal Plan', class: 'meal-plan-button'}
			]

			for (var i = 0; i < planDropdown.length; i++){
				if (planPage == planDropdown[i].name) {
					planDropdown.splice(i, 1);
				}
			}

			return planDropdown


		} else if (routeName === 'shop') {
			var shopDropdown = [
				{name: 'Smart List', class:'smart-list'},
				{name: 'Individual', class:'single-recipe'}
			]

			for (var i = 0; i < shopDropdown.length; i++){
				if (shopPage == shopDropdown[i].name) {
					shopDropdown.splice(i, 1);
				}
			}

			return shopDropdown


		} else if (routeName === 'prep') {
			var prepDropdown = [
				{name: 'Single Day', class:'single-day-prep'},
				{name: 'Week', class: 'week-prep'}
			]

			for (var i = 0; i < prepDropdown.length; i++){
				if (prepPage == prepDropdown[i].name) {
					prepDropdown.splice(i, 1);
				}
			}

			return prepDropdown
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
