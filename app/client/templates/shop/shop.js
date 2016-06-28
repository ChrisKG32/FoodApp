/*****************************************************************************/
/* Shop: Event Handlers */
/*****************************************************************************/
Template.Shop.events({
});

/*****************************************************************************/
/* Shop: Helpers */
/*****************************************************************************/
Template.Shop.helpers({
	aisles:function(param1){
		var shopPage = Session.get('shopPage');
		if (shopPage === 'Smart List') {
			var aisles = [
				{name:'Bakery', icon: 'bakery.png'},
				{name:'Canned', icon: 'canned.png'},
				{name:'Condiments', icon: 'condiments.png'},
				{name:'Dairy', icon: 'dairy.png'},
				{name:'Frozen', icon: 'frozen.png'},
				{name:'Fruits and Juices', icon: 'fruit.png'},
				{name:'Meats', icon: 'meat.png'},
				{name:'Other', icon: 'other.png'},
				{name:'Seafoods', icon: 'seafood.png'},
				{name:'Spices, Fats, Oils', icon: 'spices.png'},
				{name:'Vegetables', icon: 'vegetable.png'}
			]

			return aisles
		} else {
			return false
		}
	},
	generateList:function(){
		var thisAisle = this.name;
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne(currentUser) && 
			Meteor.users.findOne(currentUser).profile && 
			Meteor.users.findOne(currentUser).profile.assigned;

		var getWeekIds = function(){
			var today = new Date();
			var year = 2 + '' + today.getYear() - 100;
			var month = today.getMonth() + 1;
			if (month[0] != 0) {
				month = 0 + '' + month;
			}
			var day = today.getDate();
			var todayId = year+month+day;
			var data = [
				(year+month+day),
				(year+month+(day+1)),
				(year+month+(day+2)),
				(year+month+(day+3)),
				(year+month+(day+4)),
				(year+month+(day+5)),
				(year+month+(day+6))
			]
			return data
		}

		var assignedRecipes = function(){
			ingredientList = [];
			_.each(userProfile, function(entry){
				_.each(getWeekIds(), function(dayId){
					if (entry.day === dayId) {
						_.each(entry.recipes, function(recipeId){
							var recipeIngredients = Recipes.findOne(recipeId).ingredients;
							ingredientList = ingredientList.concat(recipeIngredients);
						});
					}
				})				
			});

			var fixStrings = function (ingredient){
				if (~ingredient.name.indexOf(',')) {
					ingredient.name = ingredient.name.substr(0, ingredient.name.indexOf(',')).toLowerCase();
				} else {
					ingredient.name = ingredient.name.toLowerCase();
				}
				ingredient.measurement = ingredient.measurement.toLowerCase();
				return ingredient
			}

			return ingredientList.map(fixStrings);
		}

		var seen = {};
		var mergedIngredients = assignedRecipes().filter(function(entry) {
		    var previous;

		    // Have we seen this name/measurement before?
		    if (seen.hasOwnProperty(entry.name + entry.measurement)) {
		        // Yes, grab it and add this data to it
		        previous = seen[entry.name + entry.measurement];
		        previous.amount.push(entry.amount);

		        // Don't keep this entry, we've merged it into the previous one
		        return false;
		    }

		    // entry.amount probably isn't an array; make it one for consistency
		    if (!Array.isArray(entry.amount)) {
		        entry.amount = [entry.amount];
		    }

		    // Remember that we've seen it
		    seen[entry.name + entry.measurement] = entry;

		    // Keep this one, we'll merge any others that match into it
		    return true;
		});

		var addAmounts = function(ingredient){
			var sum = ingredient.amount.reduce(add, 0);
			function add(a, b) {
				return a + b
			}

			ingredient.amount = sum

			return ingredient
		}

		return mergedIngredients.map(addAmounts)

	}
});

/*****************************************************************************/
/* Shop: Lifecycle Hooks */
/*****************************************************************************/
Template.Shop.onCreated(function () {
});

Template.Shop.onRendered(function () {
	Session.set('shopPage', 'Smart List');
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