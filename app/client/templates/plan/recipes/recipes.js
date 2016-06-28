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

		if (target.hasClass('fa-share')) {
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
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users && Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile;
		var userRecipes = userProfile && userProfile.favorites;

		var data = [];
		_.each(userRecipes, function(recipeId){
			if (recipeId != undefined) {
				data.push(Recipes.findOne({_id: recipeId}));
			}
		});

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

		} else if (planPage == param1) {
			return data
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
	}
});

/*****************************************************************************/
/* Recipes: Lifecycle Hooks */
/*****************************************************************************/
Template.Recipes.onCreated(function () {
});

Template.Recipes.onRendered(function () {
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
