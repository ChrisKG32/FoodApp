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

		var autocomplete = $('.autocomplete').is(':visible');
		if (!autocomplete){
			var recipeName = $('#recipe-name').val();
			var recipeCategory = $('#recipe-category').val();
			var recipeYield = $('#recipe-yield').val();
			var recipeDifficulty = $('#recipe-difficulty').val();

			var checkboxes = $('input[type="checkbox"]');
			var allIngredients = $('.ingredient-item');
			var imagePath = $('[type="file"]').val();
			var newImageFile = imagePath.substr(imagePath.lastIndexOf('\\') + 1, imagePath.length);
			var instructions = $('textarea#instructions').val();

			var attributes = [];
			var ingredients = [];

			_.each(allIngredients, function(entry){
				var ingredientAmt = Number($(entry).find('.amt').val());
				var ingredientUnit = $(entry).find('.unit').val();
				var ingredientName = $(entry).find('.name').val();

				var data = {
					name: ingredientName,
					measurement: ingredientUnit,
					amount: ingredientAmt
				}

				ingredients.push(data);

			});		

			_.each(checkboxes, function(entry){
				if ($(entry).hasClass('checked')){
					var boxValue = $(entry).parent().text().replace(/\s+/g, '').toLowerCase();
					attributes.push(boxValue);
				}
			});

			var data = {
				name: recipeName,
				category: recipeCategory.toLowerCase(),
				yield: recipeYield,
				difficulty: recipeDifficulty.toLowerCase(),
				attributes: attributes,
				ingredients: ingredients,
				img: newImageFile,
				instructions: instructions
			}

			if (data.name && data.category) {
				Meteor.call('addNewRecipe', data, function(){
					console.log('successfully added recipe');
				});
			} else {
				console.log('Verify all fields are filled');
			}
		} else {
			console.log('Either select existing ingredient/measurement or create a new and valid one');
		}
	},
	'keyup .ingredient-item input.name':function(e){
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
		var ingredientName = $('input.name:focus').val();
		if ((ingredientName.length) > 2 && !~ingredientName.indexOf(',')) {
			var dbResults = Ingredients.find({name: {$regex: '^' + ingredientName + '.*'}}, {limit: 3}).fetch();

			Session.set('autocomplete', dbResults);
		} else if (ingredientName.length <= 2) {
			Session.set('autocomplete', []);
		}
		Session.set('everyKey', ingredientName);
	},
	'keyup .ingredient-item input.unit':function(e){
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
		var ingredientUnit = $('input.unit:focus').val();
		if ((ingredientUnit.length) > 1 && !~ingredientUnit.indexOf(',')) {
			var dbResults = Measurements.find({name: {$regex: '^' + ingredientUnit + '.*'}}, {limit: 3}).fetch();

			Session.set('autocompleteMeasurement', dbResults);
		} else if (ingredientUnit.length <= 1) {
			Session.set('autocompleteMeasurement', []);
		}
		Session.set('everyKey', ingredientUnit);
	},
	'click .existing-ingredient span':function(e){

		//parent parent before input.name
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);

		var fieldName = currentTarget.parent();

		console.log(currentTarget);

		var inputValue = currentTarget.parent().parent().parent().prev().find('input');
		var inputIdText = inputValue.attr('id');
		var inputId = inputIdText.substr(inputIdText.lastIndexOf('-') + 1);

		if (fieldName.hasClass('name-field')) {
			var ingredientNumber = 'ingredient' + inputId;
		} else if (fieldName.hasClass('unit-field')){
			var ingredientNumber = 'unit' + inputId;
		}

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

		var autocomplete = currentTarget.parent().parent().parent();
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

	},
	'click .add-new-unit':function(e){
		var currentTarget = $(e.currentTarget);
		var inputObj = currentTarget.parent().parent().prev().find('input.unit');
		var inputIdText = inputObj.attr('id');
		var inputId = inputIdText.substr(inputIdText.lastIndexOf('-') + 1);
		var inputVal = inputObj.val();
		Session.set('newUnitInput', inputId);
		$('.autocomplete').hide();
	},
	'change .btn-success[type="file"]':function(e){
		var currentTarget = $(e.currentTarget);
		var imagePath = currentTarget.val();
		var newImageFile = imagePath.substr(imagePath.lastIndexOf('\\') + 1, imagePath.length);
		$('.image-file').attr('src', newImageFile);

	},
	'input textarea':function(e){
		$(this).outerHeight(38).outerHeight(this.scrollHeight);
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

	var textarea = $('textarea', $(this.firstNode));
	textarea.autosize();

});

Template.AddRecipe.onDestroyed(function () {
});
