/*****************************************************************************/
/* GenerateList: Event Handlers */
/*****************************************************************************/
Template.GenerateList.events({
	'click .check-all':function(e){
		var currentTarget = $(e.currentTarget);

		if (currentTarget.is(':checked')){
			$('.check-day').prop('checked', true);
		} else {
			$('.check-day').prop('checked', false);
		}

	},
	'click .expand':function(e){
		var currentTarget = $(e.currentTarget);
		var date = currentTarget.attr('date-id');
		var dropdownWrapper = $('.dropdown-recipes[date-id="' + date + '"]');
		var validRecipe = dropdownWrapper.find('.recipe-check');
		if (validRecipe.length > 0){
			if (dropdownWrapper.hasClass('hidden')) {
				dropdownWrapper.removeClass('hidden');
				currentTarget.addClass('fa-minus');
				currentTarget.removeClass('fa-plus');
				
			} else {
				dropdownWrapper.addClass('hidden');
				currentTarget.addClass('fa-plus');
				currentTarget.removeClass('fa-minus');
			}
		}
	},
	'click .check-day':function(e){

		var currentTarget = $(e.currentTarget);
		var date = currentTarget.attr('date-id');
		var recipes = currentTarget.parent().parent().find('.check-recipe');
		if (currentTarget.is(':checked')){
			recipes.prop('checked', true);
		} else {
			recipes.prop('checked', false);
		}

		if (currentTarget.hasClass('check-recipe')) {
			var container = currentTarget.parent().parent().parent().parent().parent();
			var recipeChecks = container.find('.check-recipe');
			var numberChecked = 0;

			_.each(recipeChecks, function(entry){
				var $entry = $(entry);

				if ($entry.is(':checked')) {
					numberChecked++
				}
			});
			var dayCheck = container.find('.day-check .check-day');
			if (numberChecked == recipeChecks.length) {
				dayCheck.prop('checked', true);
			} else {
				dayCheck.prop('checked', false);
			}
		}


	},
	'click .generate-button':function(e){

		var genList = function(){

			
			var currentUser = Meteor.userId();
			var userProfile = Meteor.users.findOne(currentUser) && 
				Meteor.users.findOne(currentUser).profile && 
				Meteor.users.findOne(currentUser).profile.assigned;

			/*
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
			*/

			var checkboxes = $('.check-recipe');
			var recipeIds = function(){
				var data = [];
				 _.each(checkboxes, function(entry){
					var $entry = $(entry);
					if ($entry.is(':checked')) {
						data.push($entry);
					}
				})
				 return data
			}

			var assignedRecipes = function(){
				ingredientList = [];
				//Loop through user Favorites Meals assigned to a Day
				//_.each(userProfile, function(entry){
					//Finds all ASSIGNED meals and identifies days within 7 days from TODAY
					//_.each(getWeekIds(), function(dayId){
						//If the assigned meal is within 7 days, add it to the shopping list
						//if (entry.day === dayId) {
							_.each(recipeIds(), function(checkbox){
								var recipeId = $(checkbox).attr('recipe-id');
								var recipeIngredients = Recipes.findOne(recipeId).ingredients;

								_.each(recipeIngredients, function(ingredient){
									ingredient.recipe = recipeId;
								});
								//Adds array of recipes to existing array of recipes
								// (basically a loop, but with a reactive variable)
								ingredientList = ingredientList.concat(recipeIngredients);
							});
						//}
					//})				
				//});


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

				sum = sum.toString();

				if (sum.substr(sum.indexOf('.') + 1).length > 2) {
					ingredient.amount = Number(sum).toFixed(2);
				} else {
					ingredient.amount = Number(sum);
				}


				return ingredient
			}

			var finalList =  mergedIngredients.map(addAmounts);

			/*
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
			*/

			
			var usableList = finalList;
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
		}

		var currentUser = Meteor.userId();
		var currentList = ShoppingList.findOne({creator: currentUser});
		var today = new Date();
		today = (today).toISOString().slice(0,10).replace(/-/g,"");


		if (currentList && currentList.date === today) {
			var data = {};
			data.gotIt = [];
			data.date = today;
			data.array = genList();
			data.creator = currentUser;
			console.log('replacing current shopping list');
			ShoppingList.update({_id: currentList._id},{$set: data})
		} else {
			var data = {};
			data.gotIt = [];
			data.date = today;
			data.array = genList();
			data.creator = currentUser;
			ShoppingList.insert(data);
		}

		//Session.set('list', genList());
		Session.set('shopPage', 'List');
	}
});

/*****************************************************************************/
/* GenerateList: Helpers */
/*****************************************************************************/
Template.GenerateList.helpers({
	dayCheck:function(){
		//Displays appropriate days for meal planner
		//also appends date to the ID of day element

		//(DATEVAR).toISOString().slice(0,10).replace(/-/g,"")
		//Changes ISOdate to string in following format: yyymmdd
		var dates = [];
		for (var i = 0; i < 7; i++){
			var data = {};
			var today = new Date();
			//var newDate = new Date(today);
			var newDay = new Date(today);

			var dayValue = newDay.getDate() + i;

			//var dateValue = newDate.getDate() - 1 + i;
			//newDate.setDate(dateValue);
			newDay.setDate(dayValue);
			var monthValue = newDay.getMonth();


			var days = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday'
			];
			var months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			]
			var dayDate = newDay.toISOString();
			var fixedString = dayDate.substr(dayDate.lastIndexOf('-') + 1, 2);

			if (i == 0) {
				data.fullDate = (newDay).toISOString().slice(0,10).replace(/-/g,"");
				data.day = 'Today';
				data.date = fixedString;
				data.month = months[monthValue];
				dates.push(data);
			} else {
				data.fullDate = (newDay).toISOString().slice(0,10).replace(/-/g,"");
				data.day = days[newDay.getDay()];
				data.month = months[monthValue];
				data.date = fixedString;
				dates.push(data);
			}
		}
		return dates
	},
	recipesList:function(){
		var currentUser = Meteor.userId();
		var userAccount = Meteor.users.findOne(currentUser) && 
			Meteor.users.findOne(currentUser).profile && 
			Meteor.users.findOne(currentUser).profile.assigned;
		var thisDate = this.fullDate;
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
/* GenerateList: Lifecycle Hooks */
/*****************************************************************************/
Template.GenerateList.onCreated(function () {
});

Template.GenerateList.onRendered(function () {
});

Template.GenerateList.onDestroyed(function () {
});

/*
var genList = function(){

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

				sum = sum.toString();

				if (sum.substr(sum.indexOf('.') + 1).length > 2) {
					ingredient.amount = Number(sum).toFixed(2);
				} else {
					ingredient.amount = Number(sum);
				}


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
		}
		*/