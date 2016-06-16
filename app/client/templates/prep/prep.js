/*****************************************************************************/
/* Prep: Event Handlers */
/*****************************************************************************/
Template.Prep.events({
});

/*****************************************************************************/
/* Prep: Helpers */
/*****************************************************************************/
Template.Prep.helpers({
});

/*****************************************************************************/
/* Prep: Lifecycle Hooks */
/*****************************************************************************/
Template.Prep.onCreated(function () {
});

Template.Prep.onRendered(function () {
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


					//Get final SIDEBAR position
					newPosition = sidebar[0].style.transform;
					newPositionValue = Number((newPosition.substr(0, newPosition.indexOf('p'))).slice(10));
					
					//Once button and sidebar are released, transitions them to their final
					// resting place (insert death joke here)
					if ((newPositionValue + sidebarWidth) >= (sidebarWidth/2) && newPositionValue > positionValue ) {
						var viewportWidth = $(window).width();
						var viewportPx = viewportWidth * 0.85;
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(0px)';
					} else if (newPositionValue < (sidebarWidth/2) && newPositionValue < positionValue) {
						var viewportWidth = $(window).width();
						var viewportPx = viewportWidth * 0.85;
						sidebar[0].style.transition = 'transform 0.5s ease';
						sidebar[0].style.transform = 'translate(-' + (sidebarWidth + 10) + 'px)';
					}
				});
});

Template.Prep.onDestroyed(function () {
});
