/*****************************************************************************/
/* Upload: Event Handlers */
/*****************************************************************************/
Template.Upload.events({
	'change [name="uploadCSV"]':function(e, tmpl){
		Papa.parse(event.target.files[0], {
			header: true,
			complete: function(results, file) {
				Meteor.call('parseUpload', results.data, function(error, response){
					if (error) {
						console.log(error.reason);
						
					} else {
						tmpl.uploading.set(false);
						Bert.alert('Uploading complete!', 'success', 'growl-top-right');
					}
				});
			}
		});
	}
});

/*****************************************************************************/
/* Upload: Helpers */
/*****************************************************************************/
Template.Upload.helpers({
	uploading:function(){
		return false
	}
});

/*****************************************************************************/
/* Upload: Lifecycle Hooks */
/*****************************************************************************/
Template.Upload.onCreated(function () {
});

Template.Upload.onRendered(function () {
	Template.instance().uploading = new ReactiveVar(false);
});

Template.Upload.onDestroyed(function () {
});
