/*****************************************************************************/
/* Shop: Event Handlers */
/*****************************************************************************/
Template.Shop.events({
});

/*****************************************************************************/
/* Shop: Helpers */
/*****************************************************************************/
Template.Shop.helpers({
	smartList:function(param1){
		var shopPage = Session.get('shopPage');
		if (shopPage === 'Smart List') {
			var aisles = [
				{name:'Bakery', icon: 'bakery.png'},
				{name:'Canned', icon: 'canned.png'},
				{name:'Condiments', icon: 'condiments.png'},
				{name:'Dairy', icon: 'dairy.png'},
				{name:'Frozen', icon: 'frozen.png'},
				{name:'Fruits and Juices', icon: 'fruit.png'},
				{name:'Meats', icon: 'meat.png'},
				{name:'Other', icon: 'other.png'},
				{name:'Seafoods', icon: 'seafood.png'},
				{name:'Spices, Fats, Oils', icon: 'spices.png'},
				{name:'Vegetables', icon: 'vegetable.png'}
			]

			return aisles
		} else {
			return false
		}
	}
});

/*****************************************************************************/
/* Shop: Lifecycle Hooks */
/*****************************************************************************/
Template.Shop.onCreated(function () {
});

Template.Shop.onRendered(function () {
	Session.set('shopPage', 'Smart List');
	//Meteor.defer(function(){
		Session.set('planPage', false);
		Session.set('prepPage', false);
	//}, 2000);
	
});

Template.Shop.onDestroyed(function () {
});