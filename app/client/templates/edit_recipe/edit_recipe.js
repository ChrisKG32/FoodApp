/*****************************************************************************/
/* EditRecipe: Event Handlers */
/*****************************************************************************/
Template.EditRecipe.events({
	'keyup #recipe-name':function(e){
		var searchValue = $('#recipe-name').val();
		Session.set('recipeSearch', searchValue);
	},
	'click .search-item':function(e){
		var currentTarget = $(e.currentTarget);
		var currentRecipe = this;
		
		console.log(currentRecipe);
		Session.set('searchedRecipe', currentRecipe);
		Session.set('numIngredients', 1);
	},
	'click input[type="checkbox"].check':function(e){
		var currentTarget = $(e.currentTarget);
		var textField = currentTarget.next();
		if (textField.hasClass('ingredient-item')) {
			var activeExists = $('.ingredient-item.active');
			if (!(textField.hasClass('active')) && activeExists.length > 0) {
				e.preventDefault();
			} else {
				if (currentTarget.is(':checked')) {
					console.log('derp');
					textField.removeAttr('disabled');
					textField.addClass('active');

				} else {
					textField.removeClass('active');
					textField.prop('disabled', true);
				}
			}
		} else {
			if (currentTarget.is(':checked')) {
				console.log('derp');
				textField.removeAttr('disabled');
				textField.addClass('active');

			} else {
				textField.removeClass('active');
				textField.prop('disabled', true);
			}
		}
	},
	'click .submit-changes':function(e){
		var newName = $('.recipe-name').val();
		var newAisle = $('.recipe-category').val();
		var newMeasurement = $('.recipe-difficulty').val();
		var attributes = $('.well .diets input');
		var instructions = $('textarea#instructions').val();
		var newAttrArray = [];
		_.each(attributes, function(entry){

			if ($(entry).is(':checked')) {
				var parent = $(entry).parent();
				var text = parent.text();
				var fixedString = (text.replace(/\s/g, '')).toLowerCase();
				newAttrArray.push(fixedString);
			}
		});
		var filePath = $('.image-name').val();
		var newImageFile = filePath.substr(filePath.lastIndexOf('\\') + 1, filePath.length);



		var origName = this.name;
		var origAisle = this.category;
		var origMeasurement = this.difficulty;
		var origAttr = this.attributes;
		var origImage = this.img;
		var origInstructions = this.instructions;

		if (newName != origName || newAisle != origAisle || newMeasurement != origMeasurement ||
			_.isEqual(newAttrArray, origAttr) || newImageFile != origImage || instructions != origInstructions) {
			var data = this;
			data.name = newName;
			data.category = newAisle.toLowerCase();
			data.difficulty = newMeasurement.toLowerCase();
			data.attributes = newAttrArray;
			data.img = newImageFile;
			data.instructions = instructions;

			Meteor.call('updateRecipe', data);
		} else {
			console.log('no changes');
		}
	},
	'click .cancel-changes':function(e){
		Session.set('searchedRecipe', false);
		Session.set('recipeSearch', []);
	},
	'keyup .ingredient-item':function(e){
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
		var ingredientName = $('ingredient-item:focus').val();
		if ((ingredientName.length) > 2) {
			var dbResults = Ingredients.find({name: {$regex: '^' + ingredientName + '.*'}}, {limit: 3}).fetch();

			Session.set('autocomplete', dbResults);
		} else if (ingredientName.length <= 2) {
			Session.set('autocomplete', []);
		}
		Session.set('everyKey', ingredientName);
	},
	'click .checkbox.diets label, click .checkbox.diets input':function(e){
		var currentTarget = $(e.currentTarget);
		if (currentTarget.hasClass('cb-label')){
			var checkbox = currentTarget.find('input');
			console.log(checkbox);
			
		} else {
			var checkbox = currentTarget;
			console.log(checkbox);
		}

		if (checkbox.is(':checked')) {
			checkbox.prop('checked', false);
		} else {
			checkbox.prop('checked', true);
		}
	}
});

/*****************************************************************************/
/* EditRecipe: Helpers */
/*****************************************************************************/
Template.EditRecipe.helpers({
	searchResults:function(){
		var searchValue = Session.get('recipeSearch');

		if ((searchValue && searchValue.length) > 2) {
			var dbResults = Recipes.find({name: {$regex: '^' + searchValue + '.*'}}, {limit: 10}).fetch();
		} 

		if (dbResults && dbResults.length > 0) {
			return dbResults
		} else {
			return []
		}
	},
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
/* EditRecipe: Lifecycle Hooks */
/*****************************************************************************/
Template.EditRecipe.onCreated(function () {
});

Template.EditRecipe.onRendered(function () {
	Tracker.autorun(function(){
		var searchedRecipe = Session.get('searchedRecipe');
		setTimeout(function(){
			var category = $('select.recipe-category');
			var difficulty = $('select.recipe-difficulty');
			if (category.is(':visible') && 
				difficulty.is(':visible')) {				
					category.val(searchedRecipe.category);
					difficulty.val(searchedRecipe.difficulty);
			}

		},300);
	});
});

Template.EditRecipe.onDestroyed(function () {
});
