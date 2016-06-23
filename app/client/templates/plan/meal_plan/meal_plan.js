/*****************************************************************************/
/* MealPlan: Event Handlers */
/*****************************************************************************/
Template.MealPlan.events({
	'click .add-recipe':function(e){
		console.log('add recipe needs functionality');
	},
	'click [day-id]':function(e){
		e.preventDefault();
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
		var dayId = currentTarget.attr('day-id');
		var liParent = $('[day-id=' + dayId + ']').parent();
		var hiddenRecipes = liParent.find('.assigned-recipe');
		var dropdownRecipes = liParent.find('.dropdown-recipes');
		var dropdownPlus = liParent.find('.fa');
		if (hiddenRecipes) {
			_.each(hiddenRecipes, function(entry){
				if ($(entry).is(':visible')){
					$(entry).hide();
				} else {
					$(entry).show();
				}
			});
		}
		if (dropdownRecipes) {
			/*
			_.each(hiddenRecipes, function(entry){
				if ($(entry).is(':visible')){
					$(entry).hide();
				} else {
					$(entry).show();
				}
			});
			*/
			dropdownRecipes.toggle();
			if (dropdownPlus.hasClass('fa-plus-square')) {
				dropdownPlus.removeClass('fa-plus-square');
				dropdownPlus.addClass('fa-minus-square');
			} else if (dropdownPlus.hasClass('fa-minus-square')) {
				dropdownPlus.removeClass('fa-minus-square');
				dropdownPlus.addClass('fa-plus-square');
			}

		}
	}
});

/*****************************************************************************/
/* MealPlan: Helpers */
/*****************************************************************************/
Template.MealPlan.helpers({
	dayCheck:function(){
		//Displays appropriate days for meal planner
		//also appends date to the ID of day element

		//(DATEVAR).toISOString().slice(0,10).replace(/-/g,"")
		//Changes ISOdate to string in following format: yyymmdd
		var dates = [];
		for (var i = 0; i < 7; i++){
			var data = {};
			var today = new Date();
			//var newDate = new Date(today);
			var newDay = new Date(today);

			var dayValue = newDay.getDate() + i;
			//var dateValue = newDate.getDate() - 1 + i;
			//newDate.setDate(dateValue);
			newDay.setDate(dayValue);


			var days = [
				'Sun',
				'Mon',
				'Tue',
				'Wed',
				'Thu',
				'Fri',
				'Sat'
			];

			if (i == 0) {
				data.day = 'Today';
				data.date = (newDay).toISOString().slice(0,10).replace(/-/g,"");
				dates.push(data);
			} else {
				data.day = days[newDay.getDay()];
				data.date = (newDay).toISOString().slice(0,10).replace(/-/g,"");
				dates.push(data);
			}
		}
		return dates
	},
	badges:function(){
		var currentUser = Meteor.userId();
		var userAccount = Meteor.users.findOne(currentUser) && 
			Meteor.users.findOne(currentUser).profile && 
			Meteor.users.findOne(currentUser).profile.assigned;
		var thisDate = this.date;
		var recipeCounter = 0;
		_.each(userAccount, function(entry){
			if (entry.day === thisDate){
				_.each(entry.recipes, function(recipe){
					recipeCounter++
				});
			}
		});

		return recipeCounter
	},
	recipesList:function(){
		var currentUser = Meteor.userId();
		var userAccount = Meteor.users.findOne(currentUser) && 
			Meteor.users.findOne(currentUser).profile && 
			Meteor.users.findOne(currentUser).profile.assigned;
		var thisDate = this.date;
		var recipeList = [];
		_.each(userAccount, function(entry){
			if (entry.day === thisDate){
				_.each(entry.recipes, function(recipe){
					var recipeInfo = Recipes.findOne({_id: recipe});
					recipeList.push(recipeInfo);
				});
			}
		});

		return recipeList
	}
});

/*****************************************************************************/
/* MealPlan: Lifecycle Hooks */
/*****************************************************************************/
Template.MealPlan.onCreated(function () {
});

Template.MealPlan.onRendered(function () {

		//Sidebar and sidebar button positioning/sizing
			var sidebarEl = $('#filter');
			if (sidebarEl) {
				var viewportPx = $(window).width();

				//Sets sidebar width (different for Recipes page and Meal Plan page)
				var newSidebarSize = viewportPx * 0.75;

				//Sets width and moves sidebar out of view
				sidebarEl.css('width', newSidebarSize + 'px');
				var newWidth = $('.plan-sidebar').width();
				var sbPosition = ('.plan-sidebar') && $('.plan-sidebar')[0] && $('.plan-sidebar')[0].style;
				sbPosition.transform = 'translate(-' + (newWidth + 10) + 'px)';
			}

});

Template.MealPlan.onDestroyed(function () {
});
