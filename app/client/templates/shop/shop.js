/*****************************************************************************/
/* Shop: Event Handlers */
/*****************************************************************************/
Template.Shop.events({
});

/*****************************************************************************/
/* Shop: Helpers */
/*****************************************************************************/
Template.Shop.helpers({
	list:function(){
		var currentUser = Meteor.userId();
		var shopPage = Session.get('shopPage');
		var today = new Date();
		today = (today).toISOString().slice(0,10).replace(/-/g,"");

		var shopList = ShoppingList.findOne({creator: currentUser, date: today});

		if ((shopList && shopList.date === today) && (shopPage === 'List')) {
			return true
		} else {
			return false
		}
	}
});

/*****************************************************************************/
/* Shop: Lifecycle Hooks */
/*****************************************************************************/
Template.Shop.onCreated(function () {
});

Template.Shop.onRendered(function () {
	
	var currentUser = Meteor.userId();
	var shopList = ShoppingList.findOne({creator: currentUser});
	if (shopList) {
		Session.set('shopPage', 'List');
	} else {
		Session.set('shopPage', 'Generate');
	}
	
	//Meteor.defer(function(){
		Session.set('planPage', false);
		Session.set('prepPage', false);
	//}, 2000);
	


	//Swipe Functionality
		var swipeShop = document.getElementById('shopping');
		
		//Initialize
		var swipeShopHammertime = new Hammer.Manager(swipeShop);
		

		//Create Pan Event Listener
		var SwipeShop = new Hammer.Swipe();

		//Activate event listener
		swipeShopHammertime.add(SwipeShop);
		
		
		//Below are the 3 "pan" event listeners.
			//One for "Start", one for "Pan" and one for "End"

			//Panstart gets information for the initial location of swiping elements 
			// so that it can know how far to move them based off of swipe data
		swipeShopHammertime.on('swipeleft', function(e){		
			Router.go('prep');			
		});
		swipeShopHammertime.on('swiperight', function(e){		
			Router.go('plan');			
		});
});

Template.Shop.onDestroyed(function () {
});