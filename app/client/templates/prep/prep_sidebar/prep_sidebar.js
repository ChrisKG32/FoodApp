/*****************************************************************************/
/* PrepSidebar: Event Handlers */
/*****************************************************************************/
Template.PrepSidebar.events({
	'click .filter-item':function(e){
		var currentTarget = $(e.currentTarget);
		var dropdown = currentTarget.find('.filter-list');
		var caret = currentTarget.find('.fa');
		if (caret.hasClass('fa-caret-down')) {
			$('.filter-item h5 span').removeClass('fa-caret-up').addClass('fa-caret-down');
			$('.filter-list').hide();
			dropdown.show();
			caret.removeClass('fa-caret-down');
			caret.addClass('fa-caret-up');
		} else {
			$('.filter-item h5 span').removeClass('fa-caret-up');
			$('.filter-item h5 span').addClass('fa-caret-down');
			caret.removeClass('fa-caret-up');
			caret.addClass('fa-caret-down');
			$('.filter-list').hide();
		}
	}
});

/*****************************************************************************/
/* PrepSidebar: Helpers */
/*****************************************************************************/
Template.PrepSidebar.helpers({
	filterItems:function(param1){
		var filters = [];
		var filterDiets = {

			name: 'Diets',
			array: [
				{
					name: 'Paleo',
					amount: 29
				},
				{
					name: 'Primal',
					amount: 23
				},
				{
					name: 'Keto',
					amount: 12
				},
				{
					name: 'Whole 30',
					amount: 32
				}
			]
		}

		var filterAllergens = {

			name: 'Allergens',
			array: [
				{
					name: 'Gluten-Free',
					amount: 32
				},
				{
					name: 'Dairy-Free',
					amount: 42
				},
				{
					name: 'Nut-Free',
					amount: 12
				}
			]
		}

		var filterType = {

			name: 'Types',
			array: [
				{
					name: 'Breakfast',
					amount: 51
				},
				{
					name: 'Main Course',
					amount: 34
				},
				{
					name: 'Side',
					amount: 31
				},
				{
					name: 'Soups/Salads',
					amount: 34
				},
				{
					name: 'Snacks',
					amount: 12
				},
				{
					name: 'Appetizers',
					amount: 43
				},
				{
					name: 'Dessert',
					amount: 12
				},
				{
					name: 'Sauces/Dressings',
					amount: 43
				}
			]
		}
		var filterDifficulty = {

			name: 'Difficulty',
			array: [
				{
					name: 'Beginner',
					amount: 12
				},
				{
					name: 'Intermediate',
					amount: 32
				},
				{
					name: 'Advanced',
					amount: 12
				}
			]
		};

		filters.push(filterDiets, filterAllergens, filterType, filterDifficulty);

		if (param1 == 'Filters') {
			var filterLength = filters.length;
			var data = [];
			for (var i = 0; i < filterLength; i++ ) {
				data.push(i);
			}
			return data
		} else {
			return filters
		}
		
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
