/*****************************************************************************/
/* Recipes: Event Handlers */
/*****************************************************************************/
Template.Recipes.events({
	'scroll .recipes':function(){
		var recipeItemHeight = $('.item-wrapper').height();
		var scrollDistance = $('.recipes').scrollTop();
		if (scrollDistance > breakpoint) {

			var newLimit = Session.get('recipeLimit') + 8;
			Session.set('recipeLimit', newLimit);
			breakpoint += recipeItemHeight * 4;
		}

	},
	'click .recipe-item':function(e){
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);

		var currentUser = Meteor.userId();
		var recipeId = this._id;
		var userProfile = Meteor.users && Meteor.users.findOne(currentUser);
		var userFavorites = userProfile && userProfile.profile && userProfile.profile.favorites;
		var conflicts = false;

		if (target.hasClass('fa-heart')) {
			for (var i in userFavorites) {
				if (userFavorites[i] === recipeId) {
					conflicts = true;
					break
				}
			}
			if (conflicts) {
				console.log('you already favorited this');
			} else {
				console.log('you just favorited this recipe');
				currentTarget.addClass('favorited');
				currentTarget.append('<span class="just-favorited"> Added to <br> Favorites </span>');
				var favoritedSpan = currentTarget.find('.just-favorited');
				Meteor.users.update(currentUser, {$push: {"profile.favorites": this._id}})
				favoritedSpan.fadeIn(function(){
					setTimeout(function(){
						favoritedSpan.fadeOut('slow');
						currentTarget.removeClass('favorited');
					},5000);
				});
			}
		}
	},
	'click .recipe-info':function(e){
		var currentTarget = $(e.currentTarget);


		var image = currentTarget.parent();
		image.css('z-index', '1');

		var imageWidth = parseInt(image.css('padding-left')) + 
			parseInt(image.css('padding-right')) + 
			parseInt(image.width())
		;

		$(image).animate(
			{left: - imageWidth}
		);
	},
	'click .category-header':function(e){
		var currentTarget = $(e.currentTarget);
		var span = currentTarget.find('span');

		if (span.hasClass('glyphicon-triangle-bottom')) {
			var category = currentTarget.attr('recipe-category');
			$('.section-wrapper[recipe-category="' + category + '"]').hide();
			span.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
		} else if (span.hasClass('glyphicon-triangle-top')) {
			var category = currentTarget.attr('recipe-category');
			$('.section-wrapper[recipe-category="' + category + '"]').show();
			span.removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
		}
	}
});

/*****************************************************************************/
/* Recipes: Helpers */
/*****************************************************************************/
Template.Recipes.helpers({
	//Renders recipes on in Recipe template
	'displayRecipes':function(param1, param2){
		var planPage = Session.get('planPage');
		var recipeLimit = Session.get('recipeLimit');
		var recipesList = Recipes.find({},{limit: recipeLimit}).fetch();

		if (planPage == param2) {

			var currentFilter = Session.get('currentFilter');

			if (currentFilter) {
				
				var diets = {$and: currentFilter.diets};
				var category = {$or: currentFilter.category};
				var difficulty = {$or: currentFilter.difficulty};
				var queryArray = [];

			

				if (currentFilter.diets.length < 1) {
					delete currentFilter['diets']
				} 
				if (currentFilter.category.length < 1) {
					delete currentFilter['category']
				} 
				if (currentFilter.difficulty.length < 1 ) {
					delete currentFilter['difficulty']
				}

				if (_.isEmpty(currentFilter)) {
					var recipeResults = Recipes.find({},{limit: recipeLimit}).fetch()

					return recipeResults

				} else {
					if (currentFilter.diets && currentFilter.diets.length > 0) {
						queryArray.push(diets);
					}
					if (currentFilter.category && currentFilter.category.length > 0) {
						queryArray.push(category);
					}
					if (currentFilter.difficulty && currentFilter.difficulty.length > 0) {
						queryArray.push(difficulty);
					}

					var recipeResults = Recipes.find({$and: queryArray},{limit: recipeLimit}).fetch()

					return recipeResults
				}
			}

		//} else if (planPage == param1) {
		//	return data
		} else {
			return false
		}
	},
	planPage:function(param1){
		var planPage = Session.get('planPage');
		if (planPage == param1) {
			return true
		} else {
			return false
		}
	},
	filterItems:function(){
		var filterItems = [];
		if (filterItems.length < 1) {
			return false
		} else {
			return filterItems
		}
	},
	favoritesPage:function(param1){
		var planPage = Session.get('planPage');
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users && Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile;
		var userRecipes = userProfile && userProfile.favorites;
		var data = {
			categories: [],
			recipes: []
		};
		if (param1 === 'categories') {
			_.each(userRecipes, function(recipeId){
				if (recipeId != undefined) {
					var currentRecipe = Recipes.findOne({_id: recipeId});
					data.recipes.push(currentRecipe);
					var existingCategory = false;
					_.each(data.categories, function(category){
						if (category.name === currentRecipe.category) {
							existingCategory = true;
						}
					});

					if (existingCategory == false) {
						data.categories.push({name: currentRecipe.category});
					}
					
				}
			});
			var currentFilter = Session.get('currentFilter');
			if (currentFilter) {
				
				var diets = {$and: currentFilter.diets};
				var category = {$or: currentFilter.category};
				var difficulty = {$or: currentFilter.difficulty};
				var queryArray = [];

			

				if (currentFilter.diets.length < 1) {
					delete currentFilter['diets']
				} 
				if (currentFilter.category.length < 1) {
					delete currentFilter['category']
				} 
				if (currentFilter.difficulty.length < 1 ) {
					delete currentFilter['difficulty']
				}

				if (_.isEmpty(currentFilter)) {

					return data.categories

				} else {
					if (currentFilter.diets && currentFilter.diets.length > 0) {
						queryArray.push(diets);
					}
					if (currentFilter.category && currentFilter.category.length > 0) {
						queryArray.push(category);
					}
					if (currentFilter.difficulty && currentFilter.difficulty.length > 0) {
						queryArray.push(difficulty);
					}

					data.categories = [];
					var categoryName = this.name;
					_.each(userRecipes, function(recipeId){
						if (recipeId != undefined) {
							var currentRecipe = Recipes.findOne({_id: recipeId, $and: queryArray});
							var existingCategory = false;
							if (currentRecipe) {

								_.each(data.categories, function(category){
									if (category.name === currentRecipe.category) {
										existingCategory = true;
									}
								});

								if (existingCategory == false) {
									data.categories.push({name: currentRecipe.category});
								}
							}
											
						}
					});

					return data.categories
				}
			} else {
				return data.categories
			}

		} else if (param1 === 'recipes') {
			var categoryName = this.name;
			_.each(userRecipes, function(recipeId){
				if (recipeId != undefined) {
					var currentRecipe = Recipes.findOne({_id: recipeId, category: categoryName});
					if (currentRecipe) {
						data.recipes.push(currentRecipe);	
					}
									
				}
			});

			var currentFilter = Session.get('currentFilter');
			if (currentFilter) {
				
				var diets = {$and: currentFilter.diets};
				var category = {$or: currentFilter.category};
				var difficulty = {$or: currentFilter.difficulty};
				var queryArray = [];

			

				if (currentFilter.diets.length < 1) {
					delete currentFilter['diets']
				} 
				if (currentFilter.category.length < 1) {
					delete currentFilter['category']
				} 
				if (currentFilter.difficulty.length < 1 ) {
					delete currentFilter['difficulty']
				}

				if (_.isEmpty(currentFilter)) {

					return data.recipes

				} else {
					if (currentFilter.diets && currentFilter.diets.length > 0) {
						queryArray.push(diets);
					}
					if (currentFilter.category && currentFilter.category.length > 0) {
						queryArray.push(category);
					}
					if (currentFilter.difficulty && currentFilter.difficulty.length > 0) {
						queryArray.push(difficulty);
					}
					data.recipes = [];
					var categoryName = this.name;
					_.each(userRecipes, function(recipeId){
						if (recipeId != undefined) {
							var currentRecipe = Recipes.findOne({_id: recipeId, category: categoryName, $and: queryArray});
							if (currentRecipe) {
								data.recipes.push(currentRecipe);	
							}
											
						}
					});

					return data.recipes
				}

			} else {
				return data.recipes
			}

			return data.recipes
		}
	}
});

/*****************************************************************************/
/* Recipes: Lifecycle Hooks */
/*****************************************************************************/
Template.Recipes.onCreated(function () {
});

Template.Recipes.onRendered(function () {
	//Set overflow-y to hidden for the container so when active filters
	// show up they won't cause scrolling
	$('.transitions-container').css('overflow-y', 'hidden');


	var currentFilter = {
		diets: [],
		category: [],
		difficulty: []
	}

	Session.set('currentFilter', currentFilter);

	//Set how many recipes render
	Session.set('recipeLimit', 20);	
	breakpoint = 600;

	//Sidebar and sidebar button positioning/sizing
		var sidebarEl = $('#filter');
		if (sidebarEl) {
			var viewportPx = $(window).width();

			//Sets sidebar width (different for Recipes page and Meal Plan page)
			var newSidebarSize = viewportPx * 0.9;

			//Sets width and moves sidebar out of view
			sidebarEl.css('width', newSidebarSize + 'px');
			var newWidth = $('.plan-sidebar').width();
			var sbPosition = ('.plan-sidebar') && $('.plan-sidebar')[0] && $('.plan-sidebar')[0].style;
			sbPosition.transform = 'translate(-' + (newWidth) + 'px)';
		}


		tapStage = document.getElementById('recipes-wrapper');

		//Initialize
		tapHammertime = new Hammer.Manager(tapStage);

		//Create Pan Event Listener
		Tap = new Hammer.Tap();

		//Activate event listener
		tapHammertime.add(Tap);
		
		//Below are the 3 "pan" event listeners.
			//One for "Start", one for "Pan" and one for "End"

			//Panstart gets information for the initial location of swiping elements 
			// so that it can know how far to move them based off of swipe data
		tapHammertime.on('tap', function(e){		
			var target = $(e.target);
			if (target.hasClass('recipe-item')) {

				var recipeId = target.attr('recipe-id');
				var currentRecipe = Recipes.findOne({_id: recipeId});
				Session.set('currentRecipe', recipeId);
				Router.go('details');

			}
			
			
		});


			//SWIPE ROUTES
			var swipeRecipes = document.getElementById('recipes-wrapper');
			

			//Initialize
			var swipeRecipesHammertime = new Hammer.Manager(swipeRecipes);
			

			//Create Pan Event Listener
			var Swipe = new Hammer.Swipe();

			//Activate event listener
			swipeRecipesHammertime.add(Swipe);
			
			
			//Below are the 3 "pan" event listeners.
				//One for "Start", one for "Pan" and one for "End"

				//Panstart gets information for the initial location of swiping elements 
				// so that it can know how far to move them based off of swipe data
			swipeRecipesHammertime.on('swipeleft', function(e){		
				Router.go('shop');			
			});		
		
});

Template.Recipes.onDestroyed(function () {
});
