/*****************************************************************************/
/* AddRecipe: Event Handlers */
/*****************************************************************************/
Template.AddRecipe.events({
	'click input[type="checkbox"]':function(e){
		if (e.target.checked === true) {
			$(e.target).addClass('checked');
		} else {
			$(e.target).removeClass('checked');
		}
	},
	'click .add-ingredient h4':function(e){
		var target = $(e.target);
		var currentTarget = $(e.target);
		var numIngredients = Session.get('numIngredients');
		numIngredients++
		Session.set('numIngredients', numIngredients);
	},
	'click .remove-ingredient h4':function(e){
		var target = $(e.target);
		var currentTarget = $(e.target);
		var numIngredients = Session.get('numIngredients');
		if (numIngredients > 1) {
			numIngredients--
			Session.set('numIngredients', numIngredients);
		}
		
	},
	'click .cancel-recipe':function(e){
		e.preventDefault();
	},
	'click .submit-recipe-btn':function(e){
		e.preventDefault();

		var recipeName = $('#recipe-name').val();
		var recipeCategory = $('#recipe-category').val();
		var recipeYield = $('#recipe-yield').val();
		var recipeDifficulty = $('#recipe-difficulty').val();

		var checkboxes = $('input[type="checkbox"]');
		var allIngredients = $('.ingredient-item');

		var attributes = [];
		var ingredients = [];


		_.each(allIngredients, function(entry){
			var ingredientAmt = Number($(entry).find('.amt').val());
			var ingredientUnit = $(entry).find('.unit').val();
			var ingredientName = $(entry).find('.name').val();

			var data = {
				name: ingredientName,
				unit: ingredientUnit,
				amt: ingredientAmt
			}

			ingredients.push(data);

		});		

		_.each(checkboxes, function(entry){
			if ($(entry).hasClass('checked')){
				var boxValue = $(entry).parent().text().replace(/\s+/g, '');
				attributes.push(boxValue);
			}
		});


		var data = {
			name: recipeName,
			category: recipeCategory,
			yield: recipeYield,
			difficulty: recipeDifficulty,
			attributes: attributes,
			ingredients: ingredients
		}

		console.log(data);
	},
	'keyup .ingredient-item input.name':function(e){
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
		var ingredientName = $('input.name:focus').val();
		if ((ingredientName.length) > 2) {
			var dbResults = Ingredients.find({name: {$regex: '^' + ingredientName + '.*'}}, {limit: 3}).fetch();

			Session.set('autocomplete', dbResults);
		} else if (ingredientName.length <= 2) {
			Session.set('autocomplete', []);
		}
		Session.set('everyKey', ingredientName);
	},
	'click .existing-ingredient':function(e){
		//parent parent before input.name
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
		console.log(currentTarget);
		var inputValue = currentTarget.parent().parent().prev().find('input.name');
		var inputIdText = inputValue.attr('id');
		var inputId = inputIdText.substr(inputIdText.lastIndexOf('-') + 1);
		var ingredientNumber = 'ingredient' + inputId;

		var recipeIngredients = Session.get('recipeIngredients');
		var selectedIngredient = this;
		if (recipeIngredients) {
			recipeIngredients[ingredientNumber] = selectedIngredient;			
			Session.set('recipeIngredients', recipeIngredients);
		} else {
			var data = {};
			data[ingredientNumber] = selectedIngredient;
			Session.set('recipeIngredients', data);
		}

		var autocomplete = currentTarget.parent().parent();
		inputValue.val(currentTarget.text());
		autocomplete.hide();
	},
	'click .add-new-ingredient':function(e){
		var currentTarget = $(e.currentTarget);
		var inputObj = currentTarget.parent().parent().prev().find('input.name');
		var inputIdText = inputObj.attr('id');
		var inputId = inputIdText.substr(inputIdText.lastIndexOf('-') + 1);
		var inputVal = inputObj.val();
		Session.set('newIngredientInput', inputId);
		$('.autocomplete').hide();

	}
});

/*****************************************************************************/
/* AddRecipe: Helpers */
/*****************************************************************************/
Template.AddRecipe.helpers({
	numIngredients:function(){
		var numIngredients = Session.get('numIngredients');
		var randomArray = [];
		for (var i = 0; i < numIngredients; i++){
			randomArray.push({number: i + 1});
		}
		return randomArray


	},
	attributes:function(){
		var attributes = {
			diets: {
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
					},
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
	}
});

/*****************************************************************************/
/* AddRecipe: Lifecycle Hooks */
/*****************************************************************************/
Template.AddRecipe.onCreated(function () {
});

Template.AddRecipe.onRendered(function () {
	Session.set('numIngredients', 1);
	Session.set('something', 1);
	Session.set('newIngredientInput', false);
});

Template.AddRecipe.onDestroyed(function () {
});
