/*****************************************************************************/
/* EditRecipeItem: Event Handlers */
/*****************************************************************************/
Template.EditRecipeItem.events({
});

/*****************************************************************************/
/* EditRecipeItem: Helpers */
/*****************************************************************************/
Template.EditRecipeItem.helpers({
	editPage:function(param1) {
		var searchedRecipe = Session.get('searchedRecipe');
		if (searchedRecipe) {
			searchedRecipe.category.toLowerCase();
			searchedRecipe.difficulty.toLowerCase();
			return searchedRecipe
		} else {
			return false
		}
	},
	attributes:function(){
		var attributes = {
			attributes: {
				name: 'Lifestyles',
				value: 'attributes',
				array: [
					{
						name: 'Paleo',
						value: 'paleo',
						key: 'attributes',
						amount: 29
					},
					{
						name: 'Primal',
						value: 'primal',
						key: 'attributes',
						amount: 23
					},
					{
						name: 'Keto',
						value: 'keto',
						key: 'attributes',
						amount: 12
					},
					{
						name: 'Whole 30',
						value: 'whole30',
						key: 'attributes',
						amount: 32
					},
					{
						name: 'Vegan',
						value: 'vegan',
						key: 'attributes',
						amount: 32
					},
					{
						name: 'Vegetarian',
						value: 'vegetarian',
						key: 'attributes',
						amount: 32
					},
					{
						name: "Wahl's Protocol",
						value: 'wahl\'sprotocol',
						key: 'attributes',
						amount: 32
					},
					{
						name: 'Under 6 Ingredients',
						value: '<6',
						key: 'attributes',
						amount: 32
					},
					{
						name: 'Crockpot',
						value: 'crockpot',
						key: 'attributes',
						amount: 32
					},
					{
						name: 'Under 400 Calories',
						value: '<400 calories',
						key: 'attributes',
						amount: 32
					},
					{
						name: 'Gluten-Free',
						value: 'gluten-free',
						key: 'attributes',
						amount: 32
					},
					{
						name: 'Dairy-Free',
						value: 'dairy-free',
						key: 'attributes',
						amount: 42
					}
				]
			},
			category: {
				name: 'Categories',
				value: 'category',
				array: [
					{
						name: 'Main Course',
						value: 'main-course',
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
			difficulty: {
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
		}

		return attributes
	},
	checked:function(){
		var searchedRecipe = Session.get('searchedRecipe');
		var dietName = this.value;

		var checked = false; 
		_.each(searchedRecipe.attributes, function(entry){
			if (entry === dietName) {
				checked = true;
			}
		});
		if (checked === true) {
			return 'checked'
		} else {
			return ''
		}
	}
});

/*****************************************************************************/
/* EditRecipeItem: Lifecycle Hooks */
/*****************************************************************************/
Template.EditRecipeItem.onCreated(function () {
});

Template.EditRecipeItem.onRendered(function () {
	var searchedRecipe = Session.get('searchedRecipe');
	var textarea = $('textarea', $(this.firstNode));
	textarea.autosize();
	var category = $('select.recipe-category');
	var difficulty = $('select.recipe-difficulty');
	if (category.is(':visible') && 
		difficulty.is(':visible')) {				
			category.val(searchedRecipe.category);
			difficulty.val(searchedRecipe.difficulty);
	}
});

Template.EditRecipeItem.onDestroyed(function () {
});
