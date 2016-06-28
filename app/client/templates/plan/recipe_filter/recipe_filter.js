/*****************************************************************************/
/* RecipeFilter: Event Handlers */
/*****************************************************************************/
Template.RecipeFilter.events({
	'click .filter-item':function(e){
		
		var currentTarget = $(e.currentTarget);
		var target = $(e.target)
		if (target.is('input') || target.is('label')) {

		} else {
			var dropdown = currentTarget.find('.filter-list');
			var caret = currentTarget.find('.fa');
			if (caret.hasClass('fa-caret-down')) {
				$('.filter-item h5 span').removeClass('fa-caret-up').addClass('fa-caret-down');
				$('.filter-list').hide();
				dropdown.show();
				caret.removeClass('fa-caret-down');
				caret.addClass('fa-caret-up');
			} else {
				$('.filter-item h5 span').removeClass('fa-caret-up');
				$('.filter-item h5 span').addClass('fa-caret-down');
				caret.removeClass('fa-caret-up');
				caret.addClass('fa-caret-down');
				$('.filter-list').hide();
			}
		}
	},
	'click .filter-box':function(e){

		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
 		var currentFilter = Session.get('currentFilter');

		if ( currentTarget.is(':checked') ) {
			var key = this.key;
			var value = this.value;
			var filterObj = {};
			filterObj[key] = value;
			currentFilter[key].push(filterObj);

			Session.set('currentFilter', currentFilter);

		} else if ( !currentTarget.is(':checked') ) {
			var key = this.key;
			var value = this.value;

			currentFilter[key] = _.reject(currentFilter[key], function(el) {
				return el[key] === value;
			});


			Session.set('currentFilter', currentFilter);
		}
	}
});

/*****************************************************************************/
/* RecipeFilter: Helpers */
/*****************************************************************************/
Template.RecipeFilter.helpers({
	filterItems:function(param1){
		var filters = [
			{
				name: 'Lifestyles',
				value: 'diets',
				array: [
					{
						name: 'Paleo',
						value: 'paleo',
						key: 'diets',
						amount: 29
					},
					{
						name: 'Primal',
						value: 'primal',
						key: 'diets',
						amount: 23
					},
					{
						name: 'Keto',
						value: 'keto',
						key: 'diets',
						amount: 12
					},
					{
						name: 'Whole 30',
						value: 'whole30',
						key: 'diets',
						amount: 32
					},
					{
						name: 'Vegan',
						value: 'vegan',
						key: 'diets',
						amount: 32
					},
					{
						name: 'Vegetarian',
						value: 'vegetarian',
						key: 'diets',
						amount: 32
					},
					{
						name: "Wahl's Protocol",
						value: 'wahls protocol',
						key: 'diets',
						amount: 32
					},
					{
						name: 'Under 6 Ingredients',
						value: '<6',
						key: 'diets',
						amount: 32
					},
					{
						name: 'Crockpot',
						value: 'crockpot',
						key: 'diets',
						amount: 32
					},
					{
						name: 'Under 400 Calories',
						value: '<400 calories',
						key: 'diets',
						amount: 32
					}
				]
			},

			{
				name: 'Allergens',
				value: 'diets',
				array: [
					{
						name: 'Gluten-Free',
						value: 'gluten-free',
						key: 'diets',
						amount: 32
					},
					{
						name: 'Dairy-Free',
						value: 'dairy-free',
						key: 'diets',
						amount: 42
					}
				]
			},

			{
				name: 'Categories',
				value: 'category',
				array: [
					{
						name: 'Main Course',
						value: 'main course',
						key: 'category',
						amount: 51
					},
					{
						name: 'Breakfast',
						value: 'breakfast',
						key: 'category',
						amount: 34
					},
					{
						name: 'Side',
						value: 'side',
						key: 'category',
						amount: 31
					},
					{
						name: 'Soup/Salad',
						value: 'soup/salad',
						key: 'category',
						amount: 34
					},
					{
						name: 'Snack',
						value: 'snack',
						key: 'category',
						amount: 12
					},
					{
						name: 'Appetizer',
						value: 'appetizer',
						key: 'category',
						amount: 43
					},
					{
						name: 'Dessert',
						value: 'dessert',
						key: 'category',
						amount: 12
					},
					{
						name: 'Sauce/Dressing',
						value: 'sauce/dressing',
						key: 'category',
						amount: 43
					}
				]
			},
			{
				name: 'Difficulties',
				value: 'difficulty',
				array: [
					{
						name: 'Beginner',
						value: 'beginner',
						key: 'difficulty',
						amount: 12
					},
					{
						name: 'Intermediate',
						value: 'intermediate',
						key: 'difficulty',
						amount: 32
					},
					{
						name: 'Advanced',
						value: 'advanced',
						key: 'difficulty',
						amount: 12
					}
				]
			}
		]

		if (param1 == 'Filters') {
			var filterLength = filters.length;
			var data = [];
			for (var i = 0; i < filterLength; i++ ) {
				data.push(i);
			}
			return data
		} else {
			return filters
		}
		
	},
	planPage:function(param1, param2){
		var page = Session.get('planPage');
		if (page == param1 || page == param2) {
			return true
		} else {
			return false
		}
	},
	numberRecipes:function(){

		var filterItem = this.value;
		var filterKey = this.key;

		Recipes.find().fetch();

		//DIETS $AND

		//CATEGORIES/DIFFICULTIES $OR

		var currentFilter = Session.get('currentFilter');
		var key = this.key;
		var value = this.value;
		var filterObj = {};
		filterObj[key] = value;

		if (currentFilter) {
			currentFilter[key].push(filterObj);


			var diets = {$and: currentFilter.diets};
			var category = {$or: currentFilter.category};
			var difficulty = {$or: currentFilter.difficulty};
			var queryArray = [];

			if (currentFilter){

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
					var recipeResults = Recipes.find().count();

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

					var recipeResults = Recipes.find({$and: queryArray}).count();

					return recipeResults
				}
			}
		}
		//Format for the filter MongoDB Query
			/*
			Recipes.find({
				$and: [
					{$and: currentFilter.diets }, 
					{$or: currentFilter.category },
					{$or: currentFilter.difficulty }
				]
			})
			.count();
			*/
	}
});

/*****************************************************************************/
/* RecipeFilter: Lifecycle Hooks */
/*****************************************************************************/
Template.RecipeFilter.onCreated(function () {
});

Template.RecipeFilter.onRendered(function () {
});

Template.RecipeFilter.onDestroyed(function () {
});
