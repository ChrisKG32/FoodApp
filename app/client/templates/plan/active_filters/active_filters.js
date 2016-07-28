/*****************************************************************************/
/* ActiveFilters: Event Handlers */
/*****************************************************************************/
Template.ActiveFilters.events({
	'click .active-filter-item':function(e){
		var currentTarget = $(e.currentTarget);
		var target = $(e.target);
		var currentFilter = Session.get('currentFilter');
		var section;

		if (this['attributes']) {
			section = 'attributes';
		} else if (this['category']) {
			section = 'category';
		} else if (this['difficulty']) {
			section = 'difficulty';
		}
		var clickedElement = this[section];

		currentFilter[section] = currentFilter[section].filter(function(entry){
			if (entry[section] == clickedElement) {
				return false
			} else {
				return true
			}
		});

		Session.set('currentFilter', currentFilter);





	}
});

/*****************************************************************************/
/* ActiveFilters: Helpers */
/*****************************************************************************/
Template.ActiveFilters.helpers({
	activeFilters:function(){
		var currentFilter = Session.get('currentFilter');
		var filterList = [];
		if (currentFilter && currentFilter.attributes && currentFilter.attributes.length > 0) {
			filterList = filterList.concat(currentFilter.attributes)
		}
		if (currentFilter && currentFilter.category && currentFilter.category.length > 0) {
			filterList = filterList.concat(currentFilter.category)
		}
		if (currentFilter && currentFilter.difficulty && currentFilter.difficulty.length > 0) {
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
