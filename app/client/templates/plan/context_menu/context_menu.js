/*****************************************************************************/
/* ContextMenu: Event Handlers */
/*****************************************************************************/
Template.ContextMenu.events({
	'click .meal-plan-dropdown':function(e){
		var currentTarget = $(e.currentTarget);
		var contextWidth = $('.context-menu').width();
		var contextHeight = $('.context-menu').height();
		var contextPos = $('.context-menu').position();
		var ctHeight = currentTarget.height() + 
			parseInt(currentTarget.css('padding-top')) + 
			parseInt(currentTarget.css('padding-bottom')) +
			parseInt(currentTarget.css('border-top-width'));

		var mealPlanner = $('.meal-planner');
		mealPlanner.css('transform', 'translate(' + 
			(contextPos.left + contextWidth) + 'px, ' + 
			(contextPos.top + (ctHeight*2)) + 'px)');
		mealPlanner.show();
	},
	'click .exit':function(e){
		$('.context-menu').hide();
		$('.meal-planner').hide();
	},
	'click .favorite':function(e){
		var currentUser = Meteor.userId();
		var recipeId = Session.get('currentRecipe');
		var recipeImage = $('.recipe-item' + '[recipe-id="' + recipeId + '"]');
		var userProfile = Meteor.users && Meteor.users.findOne(currentUser);
		var userFavorites = userProfile && userProfile.profile && userProfile.profile.favorites;
		var conflicts = false;
		for (var i in userFavorites) {
			if (userFavorites[i] === recipeId) {
				conflicts = true;
				break
			}
		}
		if (conflicts) {
			console.log('you already favorited this');
		} else {
			console.log('you just favorited this recipe');
			recipeImage.addClass('favorited');
			recipeImage.append('<span class="just-favorited"> Added to <br> Favorites </span>');
			var favoritedSpan = recipeImage.find('.just-favorited');
			Meteor.users.update(currentUser, {$push: {"profile.favorites": recipeId}})
			favoritedSpan.fadeIn(function(){
				setTimeout(function(){
					favoritedSpan.fadeOut('slow');
					recipeImage.removeClass('favorited');
				},5000);
			});
		}
		$('.context-menu').hide();
		$('.meal-planner').hide();
	},
	'click .mp-day':function(e){
		var currentUser = Meteor.userId();
		var currentTarget = $(e.currentTarget);
		var dayId = currentTarget.attr('date-id');
		var recipeId = Session.get('currentRecipe');
		var data = {
			day: dayId,
			recipe: recipeId
		}

		Meteor.call('addMeal', data, currentUser);
	}

});

/*****************************************************************************/
/* ContextMenu: Helpers */
/*****************************************************************************/
Template.ContextMenu.helpers({
	dayCheck:function(){
		//Displays appropriate days for meal planner
		//also appends date to the ID of day element

		//(DATEVAR).toISOString().slice(0,10).replace(/-/g,"")
		//Changes ISOdate to string in following format: yyymmdd
		var dates = [];
		for (var i = 0; i < 7; i++){
			var data = {};
			var today = new Date();
			//var newDate = new Date(today);
			var newDay = new Date(today);

			var dayValue = newDay.getDate() + i;
			//var dateValue = newDate.getDate() - 1 + i;
			//newDate.setDate(dateValue);
			newDay.setDate(dayValue);


			var days = [
				'Sun',
				'Mon',
				'Tue',
				'Wed',
				'Thu',
				'Fri',
				'Sat'
			];

			if (i == 0) {
				data.day = 'Today';
				data.date = (newDay).toISOString().slice(0,10).replace(/-/g,"");
				dates.push(data);
			} else {
				data.day = days[newDay.getDay()];
				data.date = (newDay).toISOString().slice(0,10).replace(/-/g,"");
				dates.push(data);
			}
		}
		return dates
	},
	badges:function(){
		var currentUser = Meteor.userId();
		var userAccount = Meteor.users.findOne(currentUser) && 
			Meteor.users.findOne(currentUser).profile && 
			Meteor.users.findOne(currentUser).profile.assigned;
		var thisDate = this.date;
		var recipeCounter = 0;
		_.each(userAccount, function(entry){
			if (entry.day === thisDate){
				_.each(entry.recipes, function(recipe){
					recipeCounter++
				});
			}
		});

		return recipeCounter
	}
});

/*****************************************************************************/
/* ContextMenu: Lifecycle Hooks */
/*****************************************************************************/
Template.ContextMenu.onCreated(function () {
});

Template.ContextMenu.onRendered(function () {
});

Template.ContextMenu.onDestroyed(function () {
});
