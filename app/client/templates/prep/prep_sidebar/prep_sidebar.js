/*****************************************************************************/
/* PrepSidebar: Event Handlers */
/*****************************************************************************/
Template.PrepSidebar.events({

});

/*****************************************************************************/
/* PrepSidebar: Helpers */
/*****************************************************************************/
Template.PrepSidebar.helpers({
	dayCheck:function(){
		//Displays appropriate days for meal planner
		//also appends date to the ID of day element

		//(DATEVAR).toISOString().slice(0,10).replace(/-/g,"")
		//Changes ISOdate to string in following format: yyymmdd
		var dates = [];
		for (var i = 0; i < 7; i++){
			var data = {};
			var today = new Date();
			var newDay = new Date(today);
				var dateValue = newDay.getDate() + i;
				newDay.setDate(dateValue);
			var days = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday'
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
		var userAccount = Meteor.users.findOne(currentUser) && Meteor.users.findOne(currentUser).profile && Meteor.users.findOne(currentUser).profile.assigned;
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
/* PrepSidebar: Lifecycle Hooks */
/*****************************************************************************/
Template.PrepSidebar.onCreated(function () {
});

Template.PrepSidebar.onRendered(function () {
});

Template.PrepSidebar.onDestroyed(function () {
});
