/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({
	'lib\method_name': function () {

	if (this.isSimulation) {
	//   // do some client stuff while waiting for
	//   // result from server.
	//   return;
	}
	// server method logic
	},
	'addMeal': function (data, userId) {

	    if (this.isSimulation) {
	    //   // do some client stuff while waiting for
	    //   // result from server.
	    //   return;
	    }
	    // server method logic
	    var userAccount = Meteor.users.findOne(userId);
	    var userProfile = userAccount.profile;
	    var userAssigned = userProfile.assigned;
	    var existingPlan = userAssigned.some(function(elem) { return elem.day == data.day});
	    console.log(existingPlan);
	    //Adds recipe to existing day's meal plan
	    if (existingPlan == true) {
	        Meteor.users.update(
	            {_id: userId, 'profile.assigned.day': data.day},
	            {$addToSet: {
	                'profile.assigned.$.recipes': data.recipe

	            }}
	        );

	    //creates meal plan for selected day
	    } else {
	        Meteor.users.update(
	            {_id: userId},
	            {$push: 
	                {
	                    'profile.assigned': {
	                        day: data.day,
	                        recipes: [data.recipe]
	                    }
	                }
	            }
	        )
	    }
	},
	'parseUpload':function(data){
        for (var i = 0; i < data.length; i++){
            var item = data[i],
            exists = Ingredients.findOne({_id: item.id});
            
            if (!exists){
                Ingredients.insert(item);
            } else {
                console.warn('Rejected. This item already exists.');
            }
        }
    }
});
