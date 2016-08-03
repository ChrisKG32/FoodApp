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
	}

});

/*****************************************************************************/
/* EditRecipe: Lifecycle Hooks */
/*****************************************************************************/
Template.EditRecipe.onCreated(function () {
});

Template.EditRecipe.onRendered(function () {

});

Template.EditRecipe.onDestroyed(function () {
});
