/*****************************************************************************/
/* YourRecipes: Event Handlers */
/*****************************************************************************/
Template.YourRecipes.events({
	'click .filter-item':function(e){
		var currentTarget = $(e.currentTarget);
		var target = $(e.target);
		var dropdown = currentTarget.find('.filter-list');
		var caret = currentTarget.find('.dropdown');

		if (target.hasClass('header')) {

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
		} else if (target.hasClass('page-right')) {

			var dataId = target.attr('data-id');
			var currentPage = Session.get(dataId) && Session.get(dataId).page;
			var finalPage = Session.get(dataId) && Session.get(dataId).finalPage;
			
			Session.set(dataId, {page: (currentPage + 1), finalPage: finalPage});

		} else if (target.hasClass('page-left')) {
			var dataId = target.attr('data-id');
			var currentPage = Session.get(dataId) && Session.get(dataId).page;
			var finalPage = Session.get(dataId) && Session.get(dataId).finalPage;

			Session.set(dataId, {page: (currentPage - 1), finalPage: finalPage});
		}
	}
});

/*****************************************************************************/
/* YourRecipes: Helpers */
/*****************************************************************************/
Template.YourRecipes.helpers({
	yourLists:function(param1){
		var listItems = [
			{
				name: 'main course',
				visible: 'Main Course'
			},
			{
				name: 'breakfast',
				visible: 'Breakfast'
			},
			{
				name: 'dessert',
				visible: 'Dessert'
			},
			{
				name: 'side',
				visible: 'Side'
			},
			{
				name: 'soup/salad',
				visible: 'Soup/Salad'
			},
			{
				name: 'snack',
				visible: 'Snack'
			},
			{
				name: 'appetizer',
				visible: 'Appetizer'
			},
			{
				name: 'sauce/dressing',
				visible: 'Sauce/Dressing'
			}
		]
		return listItems		
	},

	yourRecipes:function(){

		//Gets list Name (eg: Breakfast, Entree, Dessert, etc);
		var sectionPage = this.name;

		//If this hasn't already run, creates the Session variable;
		if (Session.get(sectionPage) == null) {
			//Session variable is used for determining how many pages min and max 
			//this section has
			Session.set(sectionPage, {page: 0, finalPage: 0});
		}
		

		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne({_id: currentUser}) && Meteor.users.findOne({_id: currentUser}).profile;
		var userRecipes = userProfile && userProfile.favorites;
		var recipeLookup = [];
		var finalData = [];

		//Category name same as sectionPage
		var category = this.name;

		//Loops through User Favorited recipe list and pushes each recipe 
		//to the variable "recipeLookup" as an object
		_.each(userRecipes, function(recipeId){
			if (recipeId != undefined) {
				recipeResult = Recipes.findOne({_id: recipeId, category: category});
				if (recipeResult != undefined) {
					recipeLookup.push(recipeResult);
				}
			}
		});
		//If this section has more than 4 results in its category, creates 
		//page numbers based on the results of recipeLookup (4 results per page)
		//
		if (recipeLookup.length > 4) {
			var pages = Math.ceil(recipeLookup.length/4);
			var pageNumber = 0;
			var currentSession = Session.get(sectionPage);
			var currentPage = currentSession && currentSession.page;
			Session.set(sectionPage, {page: currentPage, finalPage: pages - 1});

			//Loops through the recipeLookup variable to start adding recipes
			//to their respective pages in the finalData variable
			for (var i = 0; i < recipeLookup.length; i++){
				//Makes the first page of finalData an array
				if (i == 0) {
					finalData[0] = [];
				}

				//Pushes 4 recipes at a time to a page
				finalData[pageNumber].push(recipeLookup[i]);

				//Every 4 recipes adds one to the page number
				if (((i + 1) % 4) == 0 ) {
					pageNumber++;
					finalData[pageNumber] = [];
				}
			}
		} else {
			finalData[0] = recipeLookup;
		}

		var currentPage = Session.get(this.name) && Session.get(this.name).page;
		
		if (recipeLookup.length < 1) {
			return false
		} else {

			return finalData[currentPage]
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
	sectionEmpty:function(){
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne({_id: currentUser}) && 
			Meteor.users.findOne({_id: currentUser}).profile;
		var userRecipes = userProfile && userProfile.favorites;
		var recipeLookup = [];
		var finalData = [];
		var category = this.name;
		_.each(userRecipes, function(recipeId){
			if (recipeId != undefined) {
				recipeResult = Recipes.findOne({_id: recipeId, category: category});
				if (recipeResult != undefined) {
					recipeLookup.push(recipeResult);
				}
			}
		});

		if (recipeLookup.length > 1) {
			return false
		} else {
			return true
		}
	},
	limitPages:function(button){
		var section = this.name;
		var pageInfo = Session.get(section);
		var currentPage = pageInfo && pageInfo.page;
		var firstPage = 0;
		var finalPage = pageInfo && pageInfo.finalPage;

		if (currentPage == finalPage && button == 'next') {
			return false
		} else if (currentPage === 0 && button === 'prev') {
			return false
		} else {
			return true
		}
	}

});

/*****************************************************************************/
/* YourRecipes: Lifecycle Hooks */
/*****************************************************************************/
Template.YourRecipes.onCreated(function () {
});

Template.YourRecipes.onRendered(function () {
});

Template.YourRecipes.onDestroyed(function () {
});
