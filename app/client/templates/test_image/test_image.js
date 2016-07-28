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
	pressStarted = false;

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

				var hoverId = target.attr('id');
				Session.set('hoverId', hoverId);


				recipeId = target.attr('id');
				target.css('opacity', '0.3');
				Session.set('draggable', true);
				target.removeClass('shake');
			},
			stop: function(e, ui) {
				Session.set('hoverId', false);


				var target = $(e.target);
				target.css('opacity', '1');
				Meteor.defer(function(){
					Session.set('draggable', false);
				}, 100);
				
				pressStarted = false;
			}
		});		
		mealPlanCalendar.droppable({
			accept: '.image',
			drop: function(e, ui){
				var currentUser = Meteor.userId();
				var target = $(e.target);
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


		//Press integration with HammerJS
			new Hammer($('#filter')[0], {
				domEvents: true
			});

			$('#filter').on('press', function(e){
				var target = $(e.target);

				if (!pressStarted){
					if (target.hasClass('ui-draggable')) {
						dragItem = target;
					} else if (target.parent().hasClass('ui-draggable')) {
						dragItem = target.parent();
					}
					if (dragItem) {
						dragItem.addClass('shake');
					}
					
				}

				pressStarted = true;

				var hoverId = dragItem.attr('id');
				Session.set('hoverId', hoverId);
				
			});

			$('#filter').on('pressup', function(e){
				var target = $(e.target);

					if (dragItem.hasClass('shake')) {
						dragItem.removeClass('shake');
					}
				pressStarted = false;

				Session.set('hoverId', false);
							
			});

});

Template.TestImage.onDestroyed(function () {
});
