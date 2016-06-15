/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Login.events({
	'submit form.form':function(e){
		e.preventDefault();
		var username = $('#username').val();
		var password = $('#password').val();

		Meteor.loginWithPassword(username, password, function(error){
			if(error){
				console.log(error.reason);
			} else {
				Router.go('plan');
			}
		});
	}
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({
});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.onCreated(function () {
});

Template.Login.onRendered(function () {
});

Template.Login.onDestroyed(function () {
});
