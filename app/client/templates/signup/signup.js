/*****************************************************************************/
/* Signup: Event Handlers */
/*****************************************************************************/
Template.Signup.events({
	'submit form.form':function(e){
		e.preventDefault();
		var username = $('#username').val();
		var password = $('#password').val();
		var confirmPassword = $('#confirm-password').val();
		var profile = {
			subscription: {
				member: true,
				type: 1,
				total: 1,
				start: 'subscribe date',
				end: 'never'
			},
			favorites: [],
			assigned: [],
			records: {
				oldFavorites: [],
				oldAssigned: []
			}
		}

		Accounts.createUser({
			username: username,
			password: password,
			profile: profile
		}, function(error){
			if (error) {
				console.log(error.reason);
			} else {
				Router.go('plan');
			}
		});
	}
});

/*****************************************************************************/
/* Signup: Helpers */
/*****************************************************************************/
Template.Signup.helpers({
});

/*****************************************************************************/
/* Signup: Lifecycle Hooks */
/*****************************************************************************/
Template.Signup.onCreated(function () {
});

Template.Signup.onRendered(function () {
});

Template.Signup.onDestroyed(function () {
});
