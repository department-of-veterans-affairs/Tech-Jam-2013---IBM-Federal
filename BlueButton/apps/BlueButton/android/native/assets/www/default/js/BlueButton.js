
/* JavaScript content from js/BlueButton.js in folder common */
/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

//getPatientData("recordTarget.patientRole")

function wlCommonInit(){
alert('test2');
	if (WL.Client.getEnvironment() === 'iphone' ||
			WL.Client.getEnvironment() === 'ipad' ||
			WL.Client.getEnvironment() === 'android') {
			
			WL.usersCollection.init();

			//gets created when we initialize the collection.
			var usersCollection = null,

			//Cache variables in the DOM
			statusTag = WLJQ('div#status'),
			nameTag = WLJQ('input#name'),
			ageTag = WLJQ('input#age'),
			idTag = WLJQ('input#id'),
			tableTag = WLJQ('table#user_table'),

			//Logs messages to the console and to a div tag
			logMessage = function (msg) {
				WL.Logger.debug(msg);
				statusTag.text(msg);
				tableTag.html('');
			},

			//Simple function that check if obj is null or undefined
			checkUndefOrNull = function (obj) {
				return (typeof obj === 'undefined') || obj === null;
			},
			//Simple function that check if collection is init
			checkColInit = function (obj) {
				if ((typeof obj === 'undefined') || obj === null){
					logMessage('You must initialize the collection first.');
					return false;
				}else{ return true; }
			},

			//Generic callback called when there's a failure
			genericFailureCallback = function  (err) {
				logMessage(err + ' Error Message: ' + WL.JSONStore.getErrorMessage(err));
			};
			//END DEFINE VARS

			//Initializes the 'users' collection
//			WLJQ('button#initCollection').bind('click', function () {

					WL.Logger.debug('Called button#initCollection');

					var collectionName = 'users',
					usersSearchFields = {"age":"integer","name":"string"},
					usersAdapterOptions = {
						name: 'user',
						replace: 'updateUser',
						remove: 'deleteUser',
						add: 'addUser',
						load: {
							procedure: 'getUsers',
							params: [],
							key: 'users'
						},
						accept: function (data) {
							return (data.status === 200);
						}
					};

					var initCollectionSuccessCallback = function () {
						logMessage('Collection has been initialized');
					};
					
					usersCollection = WL.JSONStore.initCollection(
						"users",
						usersSearchFields,
						{adapter: usersAdapterOptions,
						onSuccess: initCollectionSuccessCallback,
						onFailure: genericFailureCallback,
						username: 'carlos',
						password: '12345',
						load:true}),

					getCollectionInstance = function () {

						return users;

					};
					
					//Public API
//					return {
//						getInstance : getCollectionInstance
//					};
//			});


			var getPatientData = function(path) {
				if (!checkColInit(usersCollection)) {return "uninitialized";}

				if(!patient) {
					usersCollection.findAll({onFailure: genericFailureCallback, onSuccess: function(results) {
						patient = results[0].json.ClinicalDocument;
						var arr = path.split(".");
						var obj = patient;
						for(var p in arr) {
							obj = obj[arr[p]];
						}
						return obj;
					}});
				}
				else {
					var arr = path.split(".");
					var obj = patient;
					for(var p in arr) {
						obj = obj[arr[p]];
					}
					return obj;
				}
			};

			//Convenience function to load the table with entries
			var reloadTable = function(results) {
					window.patient = results[0].json.ClinicalDocument;
					var msg = '<tr><td>ID</td><td>NAME</td><td>AGE</td></tr>',
						i = results.length,
						curr;

					if ( i < 1) {
		
						logMessage('No Entries Found');

					} else {
						while ( i-- ) {
							curr = results[i].json;
							id = results[i]._id;
							msg += '<tr><td>' + id + '</td><td>' + curr.name + '</td><td>' + curr.age + '</td></tr>';
						}
						
						WL.Logger.debug('Find Raw Results: ' + JSON.stringify(results));
						logMessage(''); //Clear Log
						tableTag.html(msg); //Add Table
					}
			};

			//Does a findAll on the 'users' collection
			WLJQ('button#find_all').bind('click', function () {

				WL.Logger.debug('Called button#find_all');
				if (!checkColInit(usersCollection)) {return;}

				usersCollection.findAll({onFailure: genericFailureCallback, onSuccess: function (results) {
						reloadTable(results);
				}});
			});//END findAll


			var getPushReqCount = function(){

				var win =   function (data) {
					return data;
				};

				var options = {onSuccess: win, onFailure: genericFailureCallback};

				usersCollection.pushRequiredCount(options);

			};

			//Adds a new user by his or her name and age
			WLJQ('button#add').bind('click', function () {

				WL.Logger.debug('Called button#store');

				var name = nameTag.val(),
					id = idTag.val(),
					age = ageTag.val();

				WL.Logger.debug('About to store name: ' + name);
				WL.Logger.debug('About to store age: ' + age);

				if (name.length < 1 || age.length < 1 ||
					checkUndefOrNull(usersCollection)) {

					logMessage('You must init the collection and provide valid values');

				} else {

					var win =   function (count) {
							logMessage('Added ' + count + ' document.');
							nameTag.val('');
							ageTag.val('');
							idTag.val('');
					};

					var options = {onSuccess: win, onFailure: genericFailureCallback};

					usersCollection.add({name: name, age: age}, options);
				}

			});//END Add Document


			//Documents that have pushRequired set to true (havent been pushed yet)
			WLJQ('button#push_required').bind('click', function () {

				WL.Logger.debug('Called button#push_required');
				if (!checkColInit(usersCollection)) {return;}

				var win =   function (data) {
					logMessage("Documents needing push : " + data );
					reloadTable(data);
				};

				var options = {onSuccess: win, onFailure: genericFailureCallback};

				usersCollection.getPushRequired(options);
			});


			//Pushes any added documents to the server
			WLJQ('button#push_all').bind('click', function () {

				WL.Logger.debug('Called button#push_all');
				if (!checkColInit(usersCollection)) {return;}

					var win =   function (data) {
						logMessage("Successfully Pushed All Documents : " + data );
					};

					var options = {onSuccess: win, onFailure: genericFailureCallback};

					usersCollection.push(options);
			});


			//Adds a new user by his or her name and age, then pushes the document
			WLJQ('button#push_selected').bind('click', function () {

				WL.Logger.debug('Called button#push_selected');
				if (!checkColInit(usersCollection)) {return;}

				var id = idTag.val();

				if (id.length < 1 ) {
					logMessage('You must provide a valid value for id');
				} else {

					var win = function (data) {
						logMessage("Successfully pushed document : " + data);
						idTag.val('');
					};

					var options = {onSuccess: win, onFailure: genericFailureCallback};

					var doc = WL.JSONStore.documentify(parseInt(id),{});

					usersCollection.pushSelected(doc, options);
				}
			});


			//Destroys the internal storage linked to the JSONStore
			WLJQ('button#destroy').bind('click', function () {

				WL.Logger.debug('Called button#destroy');

				WL.JSONStore.destroy({onFailure: genericFailureCallback, onSuccess: function () {

					logMessage('JSONStore was destroyed');

				}});

			});//END Destroy

		}//end if statement that checks for valid environments
	
	
	// Common initialization code goes here

}
/* JavaScript content from js/BlueButton.js in folder android */
/*
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}