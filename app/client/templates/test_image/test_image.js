/*****************************************************************************/
/* TestImage: Event Handlers */
/*****************************************************************************/
Template.TestImage.events({
});

/*****************************************************************************/
/* TestImage: Helpers */
/*****************************************************************************/
Template.TestImage.helpers({
});

/*****************************************************************************/
/* TestImage: Lifecycle Hooks */
/*****************************************************************************/
Template.TestImage.onCreated(function () {
});

Template.TestImage.onRendered(function () {

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
				/*
				var existingRecipes = [];
				_.each(assignedRecipes, function(entry){
					if (entry.day == dayId) {
						_.each(entry.recipes, function(id){
							existingRecipes.push(id);
						});
					}
				});
				*/

				var data = {
					day: dayId,
					recipe: recipeId
				}

				//data.recipes.push(recipeId);

				Meteor.call('addMeal', data, currentUser);


			}
		});
});

Template.TestImage.onDestroyed(function () {
});
