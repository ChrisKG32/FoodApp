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
		if (hiddenRecipes) {
			_.each(hiddenRecipes, function(entry){
				if ($(entry).is(':visible')){
					$(entry).hide();
				} else {
					$(entry).show();
				}
			});
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
			var newDay = new Date(today);
				var dateValue = newDay.getDate() + i;
				newDay.setDate(dateValue);
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
		var userAccount = Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile && Meteor.users.findOne(currentUser).profile.assigned;
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
		var userAccount = Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile && Meteor.users.findOne(currentUser).profile.assigned;
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

			/*
	//Drag and Drop
	Tracker.autorun(function(){
		console.log('derp');
		var sessionDatas = Session.get('Breakfast') && 
			Session.get('Entrée') && 
			Session.get('Dessert') &&
			Session.get('Side');

		var mealPlanSidebar = $('.your-recipes .image');
		var mealPlanCalendar = $('.calendar-wrapper .day');
		mealPlanSidebar.draggable({
			scroll: false,
			revert: true,
			revertDuration: 0,
			start: function(e, ui){
				var target = $(e.target);
				console.log('Recipe ID ' + target.attr('id'));
				recipeId = target.attr('id');
				target.css('opacity', '0.3');
			},
			stop: function(e, ui) {
				var target = $(e.target);
				target.css('opacity', '1');
			}
		});		
		mealPlanCalendar.droppable({
			accept: '.image',
			drop: function(e, ui){
				var currentUser = Meteor.userId();
				var target = $(e.target);
				console.log('Day ID ' + target.attr('id'));
				var dayId = target.attr('id');

				var userProfile = Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile;
				var assignedRecipes = userProfile.assigned;

				var data = {
					day: dayId,
					recipe: recipeId
				}

				//data.recipes.push(recipeId);

				Meteor.call('addMeal', data, currentUser);


			}
		});
	});
	*/
});

Template.MealPlan.onDestroyed(function () {
});
