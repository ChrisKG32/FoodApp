Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});


Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  where: 'client'
});

Router.route('/plan', {
	name: 'plan',
	template: 'Plan',
	where: 'client',
	waitOn:function(){
		var planPage = Session.get('planPage');
	}
});

Router.route('/shop', {
	name: 'shop',
	template: 'Shop',
	where: 'client'
});

Router.route('/prep', {
	name: 'prep',
	template: 'Prep',
	where: 'client'
});

Router.route('/login', {
	name: 'login',
	template: 'Login',
	where: 'client'
});

Router.route('/signup', {
	name: 'signup',
	template: 'Signup',
	where: 'client'
});

Router.route('/profile', {
	name: 'profile',
	template: 'Profile',
	where: 'client'
});

Router.route('/settings', {
	name: 'settings',
	template: 'Settings',
	where: 'client'
});

Router.route('/add-recipe', {
	name: 'add-recipe',
	template: 'AddRecipe',
	where: 'client'
});