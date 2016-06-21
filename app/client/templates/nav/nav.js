/*****************************************************************************/
/* Nav: Event Handlers */
/*****************************************************************************/
Template.Nav.events({
	'click .btn-logout':function(e){
		Meteor.logout();
	},
	'click .navbar-brand':function(e){
		var currentTarget = $(e.currentTarget);

		if (currentTarget.hasClass('nav-plan')){
			Session.set('planPage', 'Search Recipes');
		}
	},
	'click a.navbar-brand':function(e){
		var target = $(e.target);
		var currentTarget = $(e.currentTarget);
		/*

		if (currentTarget.hasClass('nav-prep')){
			Session.set('planPage', false);
			Session.set('shopPage', false);
			Session.set('prepPage', 'Single Day');			
		} else if (currentTarget.hasClass('nav-plan')){
			Session.set('planPage', 'Search Recipes');
			Session.set('shopPage', false);
			Session.set('prepPage', false);			
		} else if (currentTarget.hasClass('nav-shop')){
			Session.set('planPage', false);
			Session.set('shopPage', 'Smart List');
			Session.set('prepPage', false);
		}
		*/
	}

});

/*****************************************************************************/
/* Nav: Helpers */
/*****************************************************************************/
Template.Nav.helpers({
	loggedIn:function(){
		var currentUser = Meteor.userId();
		return (currentUser) ? true : false;
	},
	pageCheck:function(param1){
		var routeName = Router.current().route.getName();
		if (routeName === param1) {
			return 'active'
		} else {
			return ''
		}
	}
});

/*****************************************************************************/
/* Nav: Lifecycle Hooks */
/*****************************************************************************/
Template.Nav.onCreated(function () {
});

Template.Nav.onRendered(function () {
});

Template.Nav.onDestroyed(function () {
});
