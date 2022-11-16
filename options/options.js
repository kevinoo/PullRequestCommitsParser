
const ScriptGitHubOptions = {

	'addPullRequestTitleTableRow': function(){
		let $target = $('#pull_request_title_table > tbody');
		let row_html = $('[data-template="pull_request_title_row"]').html().replace(/%INDEX%/g, $target.find('tr').length );
		$target.append(row_html);
	},

	'removePullRequestTitleTableRow': function( event ){
		if( !confirm('Are you sure to remove this row?') ){
			return;
		}
		$(event.target).closest('tr').remove();


	},

	'restoreOptions': function(){

		let __callback = function( settings ){

			if( typeof settings !== 'undefined' ){
				settings = JSON.parse(settings);
			}else{
				settings = ScriptGitHub.vars.defaults;
			}

			settings.prefix_to_ignore = settings.prefix_to_ignore.join('\n');

			let length = 0;
			for(let i in settings.pull_request_title){
				console.dir(settings.pull_request_title[i]);
				if( settings.pull_request_title[i]['from'] !== '' ){
					length++;
				}
			}
			for(let i=0; i<=length; i++ ){
				ScriptGitHubOptions.addPullRequestTitleTableRow();
			}

			$('body').setDataInfo(settings);
		};

		if( typeof chrome !== 'undefined' ){
			chrome.storage.sync.get('settings', (result) => {
				__callback(result.settings);
			});
		}else{
			browser.storage.sync.get('settings').then( (result) => {
				__callback(result.settings);
			});
		}
	},

	'save': function(){

		if( typeof chrome !== 'undefined' ){
			browser = chrome;
		}

		let settings = $('body').getDataInfo();

		settings.prefix_to_ignore = settings.prefix_to_ignore.split('\n');

		browser.storage.sync.set({
			'settings': JSON.stringify(settings)
		});

	}

};


document.addEventListener('DOMContentLoaded', ScriptGitHubOptions.restoreOptions );
$(document).on('click','#btn_save',ScriptGitHubOptions.save);
$(document).on('click','#btn_add_pr_table_row',ScriptGitHubOptions.addPullRequestTitleTableRow);
$(document).on('click','.btn_remove_row',ScriptGitHubOptions.removePullRequestTitleTableRow);