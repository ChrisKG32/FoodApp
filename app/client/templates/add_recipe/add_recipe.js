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
		if (numIngredients > 0) {
			numIngredients--
			Session.set('numIngredients', numIngredients);
		}
		
	},
	'click .cancel-recipe':function(e){
		e.preventDefault();
	},
	'submit form':function(e){
		e.preventDefault();

		var recipeName = $('#recipe-name').val();
		var recipeCategory = $('#recipe-category').val();
		var recipeYield = $('#recipe-yield').val();
		var recipeDifficulty = $('#recipe-difficulty').val();
		/*
		var cbPaleo = $('#cb-paleo').val();
		var cbPrimal = $('#cb-primal').val();
		var cbKeto = $('#cb-keto').val();
		var cbHealthy = $('#cb-healthy').val();
		var cbGlutenFree = $('#cb-gluten-free').val();
		var cbDairyFree = $('#cb-dairy-free').val();
		var cbVegan = $('#cb-vegan').val();
		var cbVegetarian = $('#cb-vegetarian').val();
		var cbWahls = $('#cb-wahls').val();
		var cbWhole30 = $('#cb-whole-30').val();
		var cb400Cals = $('#cb-400-cals').val();
		var cbCrockpot = $('#cb-crockpot').val();
		*/

		var checkboxes = $('input[type="checkbox"]');
		var allIngredients = $('.ingredient-item');

		var attributes = [];
		var ingredients = [];


		_.each(allIngredients, function(entry){
			var ingredientAmt = $(entry).find('.amt').val();
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
			randomArray.push('something');
		}
		return randomArray
	}
});

/*****************************************************************************/
/* AddRecipe: Lifecycle Hooks */
/*****************************************************************************/
Template.AddRecipe.onCreated(function () {
});

Template.AddRecipe.onRendered(function () {
	Session.set('numIngredients', 0);
});

Template.AddRecipe.onDestroyed(function () {
});
