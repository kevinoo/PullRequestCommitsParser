
const ScriptGitHubOptions = {

	'addPullRequestTitleTableRow': function(){
		let $target = $('#pull_request_title_table > tbody');
		let row_html = $('[data-template="pull_request_title_row"]').html().replace(/%INDEX%/g, $target.find('tr').length );
		$target.append(row_html);
	},

	'addPullRequestGroupTableRow': function(){
		let $target = $('#pull_request_groups_table > tbody');
		let row_html = $('[data-template="pull_request_group_row"]').html().replace(/%INDEX%/g, $target.find('tr').length );
		$target.append(row_html);
	},

	'removeTableRow': function( event ){
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

			for(let i=0; i<=Object.keys(settings.pull_request_title).length; i++ ){
				ScriptGitHubOptions.addPullRequestTitleTableRow();
			}

			for(let i=0; i<=Object.keys(settings.pull_request_groups).length; i++ ){
				ScriptGitHubOptions.addPullRequestGroupTableRow();
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
		delete(settings.pull_request_title['%INDEX%']);
		delete(settings.pull_request_groups['%INDEX%']);

		settings.prefix_to_ignore = settings.prefix_to_ignore.split('\n');

		console.dir(settings);

		let keys = Object.keys(settings.pull_request_groups);
		console.log('keys',keys);
		for(let i=0; i<keys.length; i++ ){
			if( (settings.pull_request_groups[keys[i]]).group_name.trim() === '' ){
				delete(settings.pull_request_groups[keys[i]]);
				continue;
			}
			settings.pull_request_groups[keys[i]].words = (settings.pull_request_groups[keys[i]]).words.split(',');
		}

		browser.storage.sync.set({
			'settings': JSON.stringify(settings)
		});
	}

};


document.addEventListener('DOMContentLoaded', ScriptGitHubOptions.restoreOptions );
$(document).on('click','#btn_save',ScriptGitHubOptions.save);
$(document).on('click','#btn_add_pr_title_table_row',ScriptGitHubOptions.addPullRequestTitleTableRow);
$(document).on('click','#btn_add_pr_group_table_row',ScriptGitHubOptions.addPullRequestGroupTableRow);

// Generic use, remove a row by a table
$(document).on('click','.btn_remove_row',ScriptGitHubOptions.removeTableRow);