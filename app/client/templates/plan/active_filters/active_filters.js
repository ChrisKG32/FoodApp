/*****************************************************************************/
/* ActiveFilters: Event Handlers */
/*****************************************************************************/
Template.ActiveFilters.events({
});

/*****************************************************************************/
/* ActiveFilters: Helpers */
/*****************************************************************************/
Template.ActiveFilters.helpers({
	activeFilters:function(){
		var currentFilter = Session.get('currentFilter');
		var filterList = [];
		if (currentFilter && currentFilter.diets && currentFilter.diets.length > 1) {
			filterList = filterList.concat(currentFilter.diets)
		}
		if (currentFilter && currentFilter.category && currentFilter.category.length > 1) {
			filterList = filterList.concat(currentFilter.category)
		}
		if (currentFilter && currentFilter.difficulty && currentFilter.difficulty.length > 1) {
			filterList = filterList.concat(currentFilter.difficulty)
		}

		return filterList
	},
	'getName':function(){
		var filterName = this[Object.keys(this)[0]]
		var upperCase = filterName[0].toUpperCase() + filterName.substr(1)

		return upperCase
	}
});

/*****************************************************************************/
/* ActiveFilters: Lifecycle Hooks */
/*****************************************************************************/
Template.ActiveFilters.onCreated(function () {
});

Template.ActiveFilters.onRendered(function () {
});

Template.ActiveFilters.onDestroyed(function () {
});
