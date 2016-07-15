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
		var sidebar = $('.prep-sidebar');
		var sidebarPadding = parseInt(sidebar.css('padding-left'));
		var viewportWidth = $(window).width();
		sidebar[0].style.transition = 'transform 0.5s ease';
		sidebar[0].style.transform = 'translate(' + (viewportWidth - sidebarPadding) + 'px)';
		$('.prep-sidebar .wrapper').removeClass('hide-tab');


	},
	'click .recipe-prep-item':function(e){
		e.preventDefault();
		var currentTarget = $(e.currentTarget);
		var target = $(e.target);
		var recipeId = currentTarget.attr('id');
		var currentRecipe = Recipes.findOne({_id: recipeId});
		Session.set('currentRecipe', recipeId);
		if (currentTarget.hasClass('prep-it')) {
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

		//if (Session.get('prepPage') == 'Week'){
		//}


		if (Session.get('prepDay')){
			var dayId = Session.get('prepDay');
		} else {
			var getDayId = function(){
				var today = new Date();
				var year = 2 + '' + today.getYear() - 100;
				var month = today.getMonth() + 1;
				if (month[0] != 0) {
					month = 0 + '' + month;
				}
				var day = '' + today.getDate();
				if (day.length < 2) {
					day = 0 + day;
				}
				return year+month+day;
			}
			var dayId = getDayId();
		}
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
			if (data) {
				return data
			} else {
				return false
			}
			
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
	Session.set('prepPage', 'Prepare');
	//Meteor.defer(function(){
		Session.set('planPage', false);
		Session.set('shopPage', false);
	//}, 2000);
	
		
	//Set page identifier
			//Changes sidebar position from % to pixels so swipe will work
				//var filterSidebar = $('.prep-sidebar') && $('.prep-sidebar').position() && $('.prep-sidebar').position().left;
				var transform = $('.prep-sidebar') && $('.prep-sidebar')[0] && $('.prep-sidebar')[0].style; 
				var viewportWidth = $(window).width();
				var sidebarPadding = parseInt($('.prep-sidebar').css('padding-left'));
				transform.transform = 'translate(' + (viewportWidth - sidebarPadding) + 'px)';


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
					$('.prep-sidebar .wrapper').addClass('hide-tab');


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
						var sidebarPadding = parseInt($('.prep-sidebar').css('padding-left'));

						//Swipe SIDEBAR code
							//Prevents sidebar from swiping past left-of-viewport (Sticks to left side)
							if (positionValue + e.deltaX < (viewportWidth - sidebarWidth)) {
								sidebar[0].style.transform = "translate(" + (viewportWidth - sidebarWidth) + "px)";
							//Prevents sidebar from swiping too far off-screen on left side
							} else if ((positionValue + e.deltaX) > (viewportWidth - sidebarPadding)) {
								sidebar[0].style.transform = "translate(" + (viewportWidth - sidebarPadding) + "px)";
							//Regular swipe calculation (Original Position + Mouse distance from initial click)
							} else {
								sidebar[0].style.transform = "translate(" + (positionValue + e.deltaX) + "px)";
							}


						//if (positionValue + e.deltaX < (viewportWidth))
				});

				hammertime.on('panend', function(e){
					//Get sidebar Width
					var sidebarWidth = $('.prep-sidebar').width();
					var mealPlanPage = $('.meal-plan');
					var sidebarPadding = parseInt($('.prep-sidebar').css('padding-left'));

					//Get final SIDEBAR position
					newPosition = sidebar[0].style.transform;
					newPositionValue = Number((newPosition.substr(0, newPosition.indexOf('p'))).slice(10));
					
					//Once button and sidebar are released, transitions them to their final
					// resting place (insert death joke here)
					/*
					if ((newPositionValue > (viewportWidth - (sidebarWidth - sidebarPadding))/2) && newPositionValue > positionValue ) {
						var viewportWidth = $(window).width();
						//var viewportPx = viewportWidth * 0.85;
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(' + (viewportWidth - sidebarPadding) + '0px)';
						
					} else if (newPositionValue < (sidebarWidth/2) && newPositionValue < positionValue) {
						var viewportWidth = $(window).width();
						//var viewportPx = viewportWidth * 0.85;
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(-' + (viewportWidth - sidebarWidth) + 'px)';
					}*/


					if (newPositionValue <= (viewportWidth - (sidebarWidth/2)) && newPositionValue < positionValue) {
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(' + (viewportWidth - sidebarWidth - sidebarPadding) + 'px)';
					} else if (newPositionValue > (viewportWidth - (sidebarWidth/2)) && newPositionValue > positionValue) {
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(' + (viewportWidth - sidebarPadding) + 'px)';
						$('.prep-sidebar .wrapper').removeClass('hide-tab');
					} else if (newPositionValue > positionValue) {
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(' + (viewportWidth - sidebarPadding) + 'px)';
						$('.prep-sidebar .wrapper').removeClass('hide-tab');
					} else {
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(' + (viewportWidth - sidebarWidth ) + 'px)';

					}
				});

	//SWIPE ROUTES
		var swipePrep = document.getElementById('prep-wrapper');
		

		//Initialize
		var swipePrepHammertime = new Hammer.Manager(swipePrep);
		

		//Create Pan Event Listener
		var Swipe = new Hammer.Swipe();

		//Activate event listener
		swipePrepHammertime.add(Swipe);
		
		
		//Below are the 3 "pan" event listeners.
			//One for "Start", one for "Pan" and one for "End"

			//Panstart gets information for the initial location of swiping elements 
			// so that it can know how far to move them based off of swipe data
		swipePrepHammertime.on('swiperight', function(e){		
			Router.go('shop');			
		});

});

Template.Prep.onDestroyed(function () {
});
