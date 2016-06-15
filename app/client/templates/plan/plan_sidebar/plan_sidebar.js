/*****************************************************************************/
/* PlanSidebar: Event Handlers */
/*****************************************************************************/
Template.PlanSidebar.events({
});

/*****************************************************************************/
/* PlanSidebar: Helpers */
/*****************************************************************************/
Template.PlanSidebar.helpers({
	planPage:function(param1, param2){
		var page = Session.get('planPage');
		if (page == param1 || page == param2) {
			return true
		} else {
			return false
		}
	}
});

/*****************************************************************************/
/* PlanSidebar: Lifecycle Hooks */
/*****************************************************************************/
Template.PlanSidebar.onCreated(function () {
});

Template.PlanSidebar.onRendered(function () {
});

Template.PlanSidebar.onDestroyed(function () {
});
