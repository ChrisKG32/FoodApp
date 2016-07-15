/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.Plan.events({
});

/*****************************************************************************/
/* Plan: Helpers */
/*****************************************************************************/
Template.Plan.helpers({
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
/* Plan: Lifecycle Hooks */
/*****************************************************************************/
Template.Plan.onCreated(function () {
});

Template.Plan.onRendered(function () {
	Session.set('planPage', 'Recipes');

	//Meteor.defer(function(){
		Session.set('shopPage', false);
		Session.set('prepPage', false);
	//}, 2000);
	
	

	//Set page identifier
			//Changes sidebar position from % to pixels so swipe will work
				var filterSidebar = $('.plan-sidebar') && $('.plan-sidebar').position() && $('.plan-sidebar').position().left;
				var transform = $('.plan-sidebar') && $('.plan-sidebar')[0] && $('.plan-sidebar')[0].style; 
				transform.transform = 'translate(' + filterSidebar + 'px)';


		//Swipe integration with HammerJS.
			//Uses PAN eventlistener to stick sidebar to touch until release
			// then the sidebar will animate to the final position depending on
			// 2 factors: where the user dropped it, and how far it was moved.

			//Swipe element
			var stage = document.getElementById('filter');

			//Initialize
			var hammertime = new Hammer.Manager(stage);

			//Create Pan Event Listener
			var Pan = new Hammer.Pan();

			//Activate event listener
			hammertime.add(Pan);
			
			//Below are the 3 "pan" event listeners.
				//One for "Start", one for "Pan" and one for "End"

				//Panstart gets information for the initial location of swiping elements 
				// so that it can know how far to move them based off of swipe data
				hammertime.on('panstart', function(e){		

					//Get INITIAL sidebar location
					sidebar = $('.plan-sidebar');
					position = sidebar[0].style.transform;
					positionValue = Number((position.substr(0, position.indexOf('p'))).slice(10));
					$('.plan-sidebar').children(1).addClass('hide-tab');
					//$('.recipe-filter').addClass('hide-tab');
					//$('.your-recipes').addClass('hide-tab');


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
						var sidebarWidth = $('.plan-sidebar').width();


					if (!Session.get('draggable')) {
						//Swipe SIDEBAR code
							//Prevents sidebar from swiping past left-of-viewport (Sticks to left side)
							if (positionValue + e.deltaX > - 10) {
								sidebar[0].style.transform = "translate(-10px)";
							//Prevents sidebar from swiping too far off-screen on left side
							} else if ((positionValue + e.deltaX) < -(sidebarWidth)) {
								sidebar[0].style.transform = "translate(-" + sidebarWidth + "px)";
							//Regular swipe calculation (Original Position + Mouse distance from initial click)
							} else {
								sidebar[0].style.transform = "translate(" + (positionValue + e.deltaX) + "px)";
							}
					}
				});

				hammertime.on('panend', function(e){
					//Get sidebar Width
					var sidebarWidth = $('.plan-sidebar').width();
					var mealPlanPage = $('.meal-plan');

					//Get final SIDEBAR position
					newPosition = sidebar[0].style.transform;
					newPositionValue = Number((newPosition.substr(0, newPosition.indexOf('p'))).slice(10));
					
					if (!Session.get('draggable')) {
						//Once button and sidebar are released, transitions them to their final
						// resting place (insert death joke here)
						if ((newPositionValue + sidebarWidth) >= (sidebarWidth/2) && newPositionValue > positionValue ) {
							var viewportWidth = $(window).width();
							var viewportPx = viewportWidth * 0.85;
							sidebar[0].style.transition = 'transform 0.5s ease';
							sidebar[0].style.transform = 'translate(0px)';

							if (Session.get('planPage') == 'Meal Plan') {
								var calendar = $('.calendar-wrapper');
								var dayHeader = $('.day-header');
								var dayText = dayHeader.find('.day-text');
								var badges = dayHeader.find('.badge');
								dayText.fadeOut(function(){
									badges.fadeIn();
									dayText.fadeIn();
								});	
								$('.dropdown-recipes').hide();
								var calendarWidth = calendar.width();
								var twoColumns = (calendarWidth*(2/3)) + 15;

								calendar[0].style.transform = 'translate(' + twoColumns + 'px)';
							}
						} else if (newPositionValue < (sidebarWidth/2) && newPositionValue < positionValue) {
							var viewportWidth = $(window).width();
							var viewportPx = viewportWidth * 0.85;
							sidebar[0].style.transition = 'transform 0.5s ease';
							sidebar[0].style.transform = 'translate(-' + (sidebarWidth) + 'px)';
							$('.plan-sidebar').children(1).removeClass('hide-tab');
							//$('.recipe-filter').removeClass('hide-tab');
							//$('.your-recipes').removeClass('hide-tab');
							if (Session.get('planPage') == 'Meal Plan') {
								var dayHeader = $('.day-header');
								var badges = dayHeader.find('.badge');
								var calendar = $('.calendar-wrapper');
								var dayText = dayHeader.find('.day-text');
								dayText.fadeOut();
								badges.fadeOut(function(){
									dayText.fadeIn();
								})
								
								
								calendar[0].style.transform = 'translate(0px)';
							}
						}
					}
				});


		//Press integration with HammerJS
			new Hammer($('#plan')[0], {
				domEvents: true
			});

			$('#plan').on('press', function(e){
				var target = $(e.target);
				console.log(target)

				if (target.hasClass('recipe-item') || target.hasClass('recipe-name') || target.hasClass('recipe-title')) {
					var recipeId = target.attr('recipe-id');
					Session.set('currentRecipe', recipeId);

					var touchEvent = e.originalEvent.gesture.pointers[0];
					var clientX = touchEvent.clientX;
					var clientY = touchEvent.clientY;
					var planOffset = $('.plan').offset().top;
					var planWidth = $('.plan').width();
					var contextWidth = $('.context-menu').width();
					var contextHeight = $('.context-menu').height();
					var viewportHeight = $(window).height();
					if ((contextHeight > (viewportHeight - clientY)) && ((planWidth - clientX) < contextWidth)) {
						$('.context-menu')
						.css('transform', 'translate(' + (clientX - contextWidth) + 'px, ' + (clientY - planOffset - contextHeight) + 'px)')
						.show();
					} else if ((planWidth - clientX) < contextWidth) {
						$('.context-menu')
						.css('transform', 'translate(' + (clientX - contextWidth) + 'px, ' + (clientY - planOffset) + 'px)')
						.show();
					} else if (contextHeight > (viewportHeight - clientY)) {
						$('.context-menu')
						.css('transform', 'translate(' + (clientX) + 'px, ' + (clientY - planOffset - contextHeight) + 'px)')
						.show();
					} else {
						$('.context-menu')
						.css('transform', 'translate(' + (clientX) + 'px, ' + (clientY - planOffset) + 'px)')
						.show();
					}


					




					//$('.context-menu').css()
					//$('.context-menu').show();
				}
			});
});

Template.Plan.onDestroyed(function () {
});
