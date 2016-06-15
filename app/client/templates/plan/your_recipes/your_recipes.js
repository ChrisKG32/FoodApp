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
				name: 'Breakfast'
			},
			{
				name: 'Entrée'
			},
			{
				name: 'Dessert'
			},
			{
				name: 'Side'
			}
		]
		return listItems		
	},

	yourRecipes:function(){
		var sectionPage = this.name;
		if (Session.get(sectionPage) == null) {
			Session.set(sectionPage, {page: 0, finalPage: 0});
		}
		
		var currentUser = Meteor.userId();
		var userProfile = Meteor.users.findOne({_id: currentUser}) && Meteor.users.findOne({_id: currentUser}).profile;
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
		if (recipeLookup.length > 4) {
			var pages = Math.ceil(recipeLookup.length/4);
			var pageNumber = 0;
			var currentSession = Session.get(sectionPage);
			Session.set(sectionPage, {page: currentSession.page, finalPage: pages - 1});

			for (var i = 0; i < recipeLookup.length; i++){
				if (i == 0) {
					finalData[0] = [];
				}

				finalData[pageNumber].push(recipeLookup[i]);

				if (((i + 1) % 4) == 0 ) {
					pageNumber++;
					finalData[pageNumber] = [];
				}
			}
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
		var firstPage = 0;
		var finalPage = pageInfo && pageInfo.finalPage;
		console.log(pageInfo.page + ' and ' + pageInfo.finalPage);

		if (pageInfo.page == pageInfo.finalPage && button == 'next') {
			return false
		} else if (pageInfo.page === 0 && button === 'prev') {
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
