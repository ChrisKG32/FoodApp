/*****************************************************************************/
/* Shop: Event Handlers */
/*****************************************************************************/
Template.Shop.events({
	'click .ingredient-checkbox':function(e){
		var currentTarget = $(e.currentTarget);

		var completedItems = Session.get('gotIt');
		if (completedItems) {
			completedItems.push(this);
			currentTarget.parent().css('text-decoration', 'line-through');
			currentTarget.parent().fadeOut('slow')
			setTimeout(function(){
				Session.set('gotIt', completedItems);
				$('.ingredient-checkbox').parent().css('text-decoration', 'none').show();
				$('.ingredient-checkbox').prop('checked', false)
			}, 650);
			

		} else {
			var data = [];
			data.push(this);
			currentTarget.parent().css('text-decoration', 'line-through');
			currentTarget.parent().fadeOut('slow')
			setTimeout(function(){
				Session.set('gotIt', data);
				$('.ingredient-checkbox').parent().css('text-decoration', 'none').prop('checked', false).show();
				$('.ingredient-checkbox').prop('checked', false)
			}, 650);
			
			
		}
	},
	'click .expand-ingredient':function(e){

		var currentTarget = $(e.currentTarget);

		var parent = currentTarget.parent().parent()
		var ingredient = currentTarget.prev().find('input').attr('ingredients');
		var dropdown = $('tr[ingredients="' + ingredient + '"]');

		if (currentTarget.hasClass('fa-plus')) {
			currentTarget.removeClass('fa-plus').addClass('fa-minus');
			parent.css('border-bottom', '1px solid rgb(220,220,220)');
			dropdown.show();
		} else {
			currentTarget.removeClass('fa-minus').addClass('fa-plus');
			parent.css('border-bottom', 'none');
			dropdown.hide();
		}

		//var ingredient = currentTarget.prev().find('input').attr('ingredients');
		//var dropdown = $('tr[ingredients="' + ingredient + '"]');
	},
	'click thead':function(e){
		var currentTarget = $(e.currentTarget);
		var span = currentTarget.find('span');

		if (span.hasClass('glyphicon-triangle-bottom')) {
			var aisle = currentTarget.attr('aisle');
			$('tbody[aisle-list=' + aisle + ']').hide();
			span.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
		} else if (span.hasClass('glyphicon-triangle-top')) {
			var aisle = currentTarget.attr('aisle');
			$('tbody[aisle-list=' + aisle + ']').show();
			span.removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');

		}
	}
});

/*****************************************************************************/
/* Shop: Helpers */
/*****************************************************************************/
Template.Shop.helpers({
	generateList:function(){
		
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne(currentUser) && 
			Meteor.users.findOne(currentUser).profile && 
			Meteor.users.findOne(currentUser).profile.assigned;

		var getWeekIds = function(){
			var today = new Date();
			var todayMod = new Date();
			var year = 2 + '' + today.getYear() - 100;
			var month = today.getMonth() + 1;
			if (month[0] != 0) {
				month = 0 + '' + month;
			}
			var day = function(){
				var number = today.getDate();
				if ((number + '').length < 2) {
					number = '0' + number;
				}
				return number
			}
			var dayString = function(date) { 
			    date.setDate(date.getDate() + 1)
			    var number = date.getDate() + '';
			    if (number.length < 2) {
			        number = '0' + number;
			    }
			        
			    return number
			}

			var todayId = year+month+day;
			var data = [
				(year+month+day()),
				(year+month+(dayString(todayMod))),
				(year+month+(dayString(todayMod))),
				(year+month+(dayString(todayMod))),
				(year+month+(dayString(todayMod))),
				(year+month+(dayString(todayMod))),
				(year+month+(dayString(todayMod)))
			]
			return data
		}


		var assignedRecipes = function(){
			ingredientList = [];
			//Loop through user Favorites Meals assigned to a Day
			_.each(userProfile, function(entry){
				//Finds all ASSIGNED meals and identifies days within 7 days from TODAY
				_.each(getWeekIds(), function(dayId){
					//If the assigned meal is within 7 days, add it to the shopping list
					if (entry.day === dayId) {
						_.each(entry.recipes, function(recipeId){
							var recipeIngredients = Recipes.findOne(recipeId).ingredients;

							_.each(recipeIngredients, function(ingredient){
								ingredient.recipe = recipeId;
							});
							//Adds array of recipes to existing array of recipes
							// (basically a loop, but with a reactive variable)
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
				ingredient.scale = ingredient.measurement.toLowerCase();

				var dbResult = Ingredients.findOne({name: ingredient.name});
				if (dbResult) {
					ingredient.name = dbResult.name + '*';
					ingredient.aisle = dbResult.aisle;

					if (dbResult.measurement == 'ea' || ingredient.scale == 'ea'){
						ingredient.scale = '';
					}
				}
				return ingredient
				
			}
			
			return ingredientList.map(fixStrings);
		}


		var seen = {};
		var mergedIngredients = assignedRecipes().filter(function(entry) {
		    var previous;
		    var ingredients;

		    // Have we seen this name/measurement before?
		    if (seen.hasOwnProperty(entry.name + entry.scale)) {
		        // Yes, grab it and add this data to it
		        previous = seen[entry.name + entry.scale];
		        ingredients = seen[entry.name + entry.scale];
		        var obj = {
		        	aisle: entry.aisle,
		        	amount: entry.amount,
		        	measurement: entry.measurement,
		        	name: entry.name,
		        	recipe: entry.recipe,
		        	scale: entry.scale
		        }
		        ingredients.ingredients.push(obj);
		        previous.amount.push(entry.amount);

		        // Don't keep this entry, we've merged it into the previous one
		        return false
		    }
		    if (!entry.ingredients){
		    	var obj = {
		        	aisle: entry.aisle,
		        	amount: entry.amount,
		        	measurement: entry.measurement,
		        	name: entry.name,
		        	recipe: entry.recipe,
		        	scale: entry.scale
		        }
		    	entry.ingredients = [obj];
		    }

		    // entry.amount probably isn't an array; make it one for consistency
		    if (!Array.isArray(entry.amount)) {
		        entry.amount = [entry.amount];
		        
		    }
		    

		    // Remember that we've seen it
		    seen[entry.name + entry.scale] = entry;

		    // Keep this one, we'll merge any others that match into it

		    	return true		    
		    
		});

		
		var addAmounts = function(ingredient){

			var sum = ingredient.amount.reduce(add, 0);

			function add(a, b) {
				return a + b
			}

			ingredient.amount = sum;

			return ingredient
		}

		var finalList =  mergedIngredients.map(addAmounts);

		var completedItems = Session.get('gotIt');

		if (completedItems && completedItems.length > 0) {

			var updatedList = finalList.filter(function(object){
				var match = false;

				_.each(completedItems, function(entry){
					var entryId = entry.name + entry.aisle + entry.amount + entry.measurement;
					var objectId = object.name + object.aisle + object.amount + object.measurement;
					if (entryId === objectId) {
						match = true;
					}
				});

				if (match === false) {
					return object
				}
			});
		}

		
		var usableList = updatedList || finalList;
		usableList = usableList.sort(function(item1, item2){
		    return item1.aisle.localeCompare(item2.aisle);
		})

		var aisleArray = [];

		_.each(usableList, function(entry){
			var conflict = false;
			for(var i = 0; i < aisleArray.length; i++) {
				if (entry.aisle === aisleArray[i].name) {
					conflict = true;
				}
			}
			if (conflict === false) {
				var data = {
					name: entry.aisle,
					display: (entry.aisle)[0].toUpperCase() + entry.aisle.substr(1)
				}
				aisleArray.push(data)
			}
			_.each(aisleArray, function(entry2){
				if (entry2.name === entry.aisle) {
					if (entry2.ingredient) {
						entry2.ingredient.push(entry);
					} else {
						entry2.ingredient = [];
						entry2.ingredient.push(entry);
					}
				}
			});
		});


		return aisleArray
		
	},
	gotIt:function(){
		var completedItems = Session.get('gotIt');

		if (completedItems && completedItems.length > 0) {
			return true
		} else {
			return false
		}
	},
	completedItems:function(){
		var completedItems = Session.get('gotIt');

		if (completedItems && completedItems.length > 0) {
			return completedItems
		} else {
			return false
		}
	},
	recipeName:function(){
		var recipeId = this.recipe;
		var recipe = Recipes.findOne(recipeId);
		return recipe && recipe.name
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