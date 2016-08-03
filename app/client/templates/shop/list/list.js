/*****************************************************************************/
/* List: Event Handlers */
/*****************************************************************************/
Template.List.events({
	'click .ingredient-checkbox':function(e){
		var currentTarget = $(e.currentTarget);
		var clickedItem = this;

		var completedItems = Session.get('gotIt');
		if (completedItems) {
			
			completedItems.push(this);
			currentTarget.parent().css('text-decoration', 'line-through');
			currentTarget.parent().fadeOut('slow')
			setTimeout(function(){

				var currentUser = Meteor.userId();
				var today = new Date();
				today = (today).toISOString().slice(0,10).replace(/-/g,"");
				var list = ShoppingList.findOne({creator: currentUser, date: today});

				Session.set('gotIt', completedItems);

				ShoppingList.update({_id: list._id}, {$addToSet: {gotIt: clickedItem}});


				$('.ingredient-checkbox').parent().css('text-decoration', 'none').show();
				$('.ingredient-checkbox').prop('checked', false)
			}, 650);




			

		} else {
			var data = [];
			data.push(this);
			currentTarget.parent().css('text-decoration', 'line-through');
			currentTarget.parent().fadeOut('slow')
			setTimeout(function(){

				var currentUser = Meteor.userId();
				var today = new Date();
				today = (today).toISOString().slice(0,10).replace(/-/g,"");
				var list = ShoppingList.findOne({creator: currentUser, date: today});
				ShoppingList.update({_id: list._id}, {$addToSet: {gotIt: clickedItem}});

				Session.set('gotIt', data);
				$('.ingredient-checkbox').parent().css('text-decoration', 'none').prop('checked', false).show();
				$('.ingredient-checkbox').prop('checked', false)
			}, 650);
			
			
		}
	},
	'click .expand-ingredient':function(e){

		var currentTarget = $(e.currentTarget);

		var parent = currentTarget.parent().parent()
		var ingredient = currentTarget.prev().find('input').attr('ingredients');
		var dropdown = $('tr[ingredients="' + ingredient + '"]');

		if (currentTarget.hasClass('fa-plus')) {
			currentTarget.removeClass('fa-plus').addClass('fa-minus');
			parent.css('border-bottom', '1px solid rgb(220,220,220)');
			dropdown.show();
		} else {
			currentTarget.removeClass('fa-minus').addClass('fa-plus');
			parent.css('border-bottom', '1px solid rgb(230,230,230)');
			dropdown.hide();
		}

		//var ingredient = currentTarget.prev().find('input').attr('ingredients');
		//var dropdown = $('tr[ingredients="' + ingredient + '"]');
	},
	'click thead':function(e){
		var currentTarget = $(e.currentTarget);
		var span = currentTarget.find('span');

		if (span.hasClass('glyphicon-triangle-top')) {
			var aisle = currentTarget.attr('aisle');
			$('tbody[aisle-list=' + aisle + ']').hide();
			span.removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
		} else if (span.hasClass('glyphicon-triangle-bottom')) {
			var aisle = currentTarget.attr('aisle');
			$('tbody[aisle-list=' + aisle + ']').show();
			span.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');

		}
	}
});

/*****************************************************************************/
/* List: Helpers */
/*****************************************************************************/
Template.List.helpers({
	generateList:function(){
		var currentUser = Meteor.userId();
		var today = new Date();
		today = (today).toISOString().slice(0,10).replace(/-/g,"");
		var list = ShoppingList.findOne({creator: currentUser, date: today});




		if (list && list.date === today) {

			var listArray = list.array;		
			var gotIt = list.gotIt;

			if (gotIt && gotIt.length > 0){



				_.each(listArray, function(aisle){
					var ingredient = aisle.ingredient;
					
					aisle.ingredient = ingredient.filter(function(item){
						var match = false;

						for (var i = 0; i < gotIt.length; i++){
							var equal = _.isEqual(gotIt[i], item);
							if (equal) {
								match = true;
								break
							}
						}

						if (match === false) {
							return true
						} else {
							return false
						}

					});

				});

				ShoppingList.update({_id: list._id}, {$set: {array: listArray}});

				return list
			} else {
				return list
			}

		} else {
			return false
		}
		

		
	},
	gotIt:function(){
		//var completedItems = Session.get('gotIt');
		var currentUser = Meteor.userId();
		var today = new Date();
		today = (today).toISOString().slice(0,10).replace(/-/g,"");
		var list = ShoppingList.findOne({creator: currentUser, date: today});
		var gotIt = list.gotIt;

		if (gotIt && gotIt.length > 0) {
			return gotIt
		} else {
			return false
		}
	},
	completedItems:function(){
		var completedItems = Session.get('gotIt');

		if (completedItems && completedItems.length > 0) {
			return completedItems
		} else {
			return false
		}
	},
	recipeName:function(){
		var recipeId = this.recipe;
		var recipe = Recipes.findOne(recipeId);
		return recipe && recipe.name
	},
	aisleExists:function(){
		var aisle = this.ingredient;
		if (aisle && aisle.length > 0) {
			return true
		} else {
			return false
		}
	}
});

/*****************************************************************************/
/* List: Lifecycle Hooks */
/*****************************************************************************/
Template.List.onCreated(function () {
});

Template.List.onRendered(function () {
	
});

Template.List.onDestroyed(function () {
});
