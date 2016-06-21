/*****************************************************************************/
/* Prep: Event Handlers */
/*****************************************************************************/
Template.Prep.events({
	'click .list-group-item':function(e){
		e.preventDefault();
		var currentTarget = $(e.currentTarget);
		if (e.ctrlKey) {
			currentTarget.addClass('active');
			//ctrl functionality pending
		} else if (e.shiftKey) {
			//shift functionality pending
		} else /*if (!e.ctrlKey && !e.shiftKey)*/ {
			$('.list-group-item').removeClass('active');
			currentTarget.addClass('active');
			var dayId = currentTarget.attr('id');
			Session.set('prepDay', dayId);
		}
		sidebar = $('.prep-sidebar');
		sidebarWidth = sidebar.width();
		sidebar[0].style.transition = 'transform 0.5s ease';
		sidebar[0].style.transform = 'translate(-' + (sidebarWidth + 10) + 'px)';


	},
	'click .recipe-prep-item':function(e){
		e.preventDefault();
		var currentTarget = $(e.currentTarget);
		var target = $(e.target);
		var recipeId = currentTarget.attr('id');
		var currentRecipe = Recipes.findOne({_id: recipeId});
		Session.set('currentRecipe', recipeId);
		if (target.hasClass('prep-it')) {
			Router.go('details');
		}
	}
});

/*****************************************************************************/
/* Prep: Helpers */
/*****************************************************************************/
Template.Prep.helpers({
	meals:function(){
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile;
		var userRecipes = userProfile && userProfile.favorites;
	},
	renderMeals:function(){
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile;
		var userMealPlan = userProfile && userProfile.assigned;
		var dayId = Session.get('prepDay');
		var dayCheck = function(){
			for (var i = 0; i < userMealPlan.length; i++){
				if (userMealPlan[i].day === dayId) {
					return i
					break
				}
			}
		}
		var returnVariable = userMealPlan && userMealPlan[dayCheck()] && userMealPlan[dayCheck()].recipes;
		var data = [];
		_.each(returnVariable, function(entry){
			var recipeResult = Recipes.findOne({_id: entry});
			data.push(recipeResult);
		});
		return data
	},
	dayText:function(){
		var dayId = Session.get('prepDay');
		if (dayId && $('.list-group-item')) {
			var correctDay = $('#' + dayId + ' span:first-child').text()
			if (correctDay) {
				return correctDay
			} else {
				return 'Today'
			}
		} else {
			return 'Today'
		}		
	}
});

/*****************************************************************************/
/* Prep: Lifecycle Hooks */
/*****************************************************************************/
Template.Prep.onCreated(function () {
});

Template.Prep.onRendered(function () {

	Session.set('prepPage', 'Single Day');
	//Set page identifier
			//Changes sidebar position from % to pixels so swipe will work
				var filterSidebar = $('.prep-sidebar') && $('.prep-sidebar').position() && $('.prep-sidebar').position().left;
				var transform = $('.prep-sidebar') && $('.prep-sidebar')[0] && $('.prep-sidebar')[0].style; 
				transform.transform = 'translate(' + filterSidebar + 'px)';


			//Swipe integration with HammerJS.
				//Uses PAN eventlistener to stick sidebar to touch until release
				// then the sidebar will animate to the final position depending on
				// 2 factors: where the user dropped it, and how far it was moved.

			//Swipe element
			stage = document.getElementById('prep-sidebar');

			//Initialize
			hammertime = new Hammer.Manager(stage);

			//Create Pan Event Listener
			Pan = new Hammer.Pan();

			//Activate event listener
			hammertime.add(Pan);
			
			//Below are the 3 "pan" event listeners.
				//One for "Start", one for "Pan" and one for "End"

				//Panstart gets information for the initial location of swiping elements 
				// so that it can know how far to move them based off of swipe data
				hammertime.on('panstart', function(e){		

					//Get INITIAL sidebar location
					sidebar = $('.prep-sidebar');
					position = sidebar[0].style.transform;
					positionValue = Number((position.substr(0, position.indexOf('p'))).slice(10));


					//Removes transition that was applied on "PanEnd"
					//******************************************************************************************
					// if transition isn't removed, the swipe won't transition properly during the "Pan" event
					//******************************************************************************************
					sidebar[0].style.transition = '';

				});
				hammertime.on('pan', function(e){

						//Get viewport width to calculate proper sidebar width from Viewport Units to pixels
						var viewportWidth = $(window).width();
						var viewportPx = viewportWidth * 0.85;
						var sidebarWidth = $('.prep-sidebar').width();

						//Swipe SIDEBAR code
							//Prevents sidebar from swiping past left-of-viewport (Sticks to left side)
							if (positionValue + e.deltaX > 0) {
								sidebar[0].style.transform = "translate(0px)";
							//Prevents sidebar from swiping too far off-screen on left side
							} else if ((positionValue + e.deltaX) < -(sidebarWidth)) {
								sidebar[0].style.transform = "translate(-" + sidebarWidth + "px)";
							//Regular swipe calculation (Original Position + Mouse distance from initial click)
							} else {
								sidebar[0].style.transform = "translate(" + (positionValue + e.deltaX) + "px)";
							}
				});

				hammertime.on('panend', function(e){
					//Get sidebar Width
					var sidebarWidth = $('.prep-sidebar').width();
					var mealPlanPage = $('.meal-plan');

					//Get final SIDEBAR position
					newPosition = sidebar[0].style.transform;
					newPositionValue = Number((newPosition.substr(0, newPosition.indexOf('p'))).slice(10));
					
					//Once button and sidebar are released, transitions them to their final
					// resting place (insert death joke here)
					if ((newPositionValue + sidebarWidth) >= (sidebarWidth/4) && newPositionValue > positionValue ) {
						var viewportWidth = $(window).width();
						var viewportPx = viewportWidth * 0.85;
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(0px)';
						if (Session.get('planPage') == 'Meal Plan') {
							var calendar = $('.calendar-wrapper');
							var dayHeader = $('.day-header');
							var badges = dayHeader.find('.badge');
							var calendarWidth = calendar.width();
							var twoColumns = (calendarWidth*(2/3)) + 15;

							//badges.toggle();
							calendar[0].style.transform = 'translate(' + twoColumns + 'px)';
						}
					} else if (newPositionValue < (sidebarWidth/2) && newPositionValue < positionValue) {
						var viewportWidth = $(window).width();
						var viewportPx = viewportWidth * 0.85;
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(-' + (sidebarWidth + 10) + 'px)';
						if (Session.get('planPage') == 'Meal Plan') {
							var dayHeader = $('.day-header');
							var badges = dayHeader.find('.badge');
							var calendar = $('.calendar-wrapper');
							
							//badges.fadeOut();
							calendar[0].style.transform = 'translate(0px)';
						}
					}
				});



});

Template.Prep.onDestroyed(function () {
});
