
const PlatformSettings = {

	'default': {
		'getSectionKey': function( commit_message ){
			commit_message = commit_message.toLowerCase();

			// add || added || create
			if( commit_message.startsWith('add') || commit_message.startsWith('create') ){
				return 'added';
			}

			if( commit_message.startsWith('deprecated') ){
				return 'deprecated';
			}

			// remove || removed
			if( commit_message.startsWith('remove') || commit_message.startsWith('delete') ){
				return 'removed';
			}

			return 'fixed';
		},

		'getCurrentCommitsList': function(){
			return [];
		}
	},

	'bitbucket_legacy': {
		'new_line_char': '<br>',
		'timer': 1500,

		'getCurrentCommitsList': function(){
			return $('#id_description').val()
				.replace(/\\/g, '')
				.split("\n")
				.filter(str => str.length && (str.replace(/\u200C/g,'') !== ''))
				.map(str => {
					return (str.substring(0,2) === '* ' ? str.substring(2) : str);
				});
		},

		'buildCommitMessage': function( settings, section_key, commits_array ){
			return '<h2>'+ ScriptGitHub.capitalizeString(section_key) +'</h2>' +
				'<ul class="ak-ul" data-indent-level="1">' +
					'<li>'+ commits_array.join('</li><li>') +'</li>' +
				'</ul>'
		},

		'setPullRequestTitle': function( content ){
			$('#id_title').val(content);
		},

		'setPullRequestDescription': function( content ){
			$('#id_description_group .ua-chrome').html(content);
		},

		'getBranchName': function( direction ){

			let $target;
			if( direction === 'to' ){
				$target = $('select[data-field="dest"]');
			}else{
				$target = $('select[data-field="source"]');
			}

			return $target.find('option:selected').text();
		},
	},

	'bitbucket_v2022': {
		'new_line_char': '<br>',
		'timer': 2000,

		'getCurrentCommitsList': function(){
			let $li = $('[role="textbox"]').find('li');
			let actual_commits = [];

			if( $li.length === 0 ){
				let $title = $('input[id^="title-"]');
				let single_commit = $title.val();
				// // Clean the title
				// setTimeout(function(){
				// 	$('input[id^="title-"]').focus().val('');
				// },150);
				// Returns the single commit message in the PR
				return [single_commit];
			}

			$li.each(function(_,li){
				let $target = $(li).find('> p');
				actual_commits.push($target.text());
			});
			return actual_commits;
		},

		'buildCommitMessage': function( settings, section_key, commits_array ){
			return '<h2>'+ ScriptGitHub.capitalizeString(section_key) +'</h2>' +
				'<ul class="ak-ul" data-indent-level="1">' +
				'<li><p>'+ commits_array.join('</p></li><li><p>') +'</p></li>' +
				'</ul>'
		},

		'setPullRequestTitle': function( content ){
			// This parent title div has a magic JS event.
			// Removing this, cloning and re-append the JS event will be removed :-)
			let $target = $('input[id^="title-"]');

			// Catch the parent of the <input> and <label> of Title
			let $box = $target.parent().parent();

			// Clone the parent <div>
			let $new_div = $target.parent().clone();
			$new_div.find('input').val(content);

			// Remove div title malvagio :-D
			$target.parent().remove();

			// Set new title box
			$box.append($new_div);
		},

		'setPullRequestDescription': function( content ){
			$('div[role="textbox"]').html(content);
		},

		'getBranchName': function( direction ){

			let $target;
			if( direction === 'to' ){
				$target = $('[for^="destination-"]').next();
			}else{
				$target = $('[for^="source-"]').next();
			}

			return $target.text();
		},
	},

	'github': {
		'new_line_char': "\n",
		'timer': 500,

		'getCurrentCommitsList': function(){
			let actual_commits = [];
			$('#commits_bucket').find('li').each(function(_,li){
				let $target = $(li).find('> .Details');
				actual_commits.push(
					($target.find('> p > a').text() + $target.find('> .Details-content--hidden > pre').text()).replace(/…/g,'')
				);
			});
			return actual_commits;
		},

		'buildCommitMessage': function( settings, section_key, commits_array ){
			const NL = "\n";
			return '## '+ ScriptGitHub.capitalizeString(section_key) +' '+ NL +'- '+ commits_array.join(NL +'- ') +NL+NL
		},

		'setPullRequestTitle': function( content ){
			$('#pull_request_title').val(content);
		},

		'setPullRequestDescription': function( content ){
			$('#pull_request_body').val(content);
		},

		'getBranchName': function( direction ){

			let $target;
			if( direction === 'to' ){
				$target = $('.range-cross-repo-pair').last();
			}else{
				$target = $('.range-cross-repo-pair').first();
			}

			return $target.find('.select-menu > .btn.branch > span').text();
		},
	},

	'get': function(){

		let platform_name = 'default';

		if( location.origin.match(/bitbucket/) ){
			if( $('#id_description').length ){
				platform_name = 'bitbucket_legacy';
			}else{
				// New layout of BitBucket from 2022-11-15
				platform_name = 'bitbucket_v2022';
			}
		}

		if( location.origin.match(/github/) ){
			platform_name = 'github';
		}

		return $.extend({},PlatformSettings.default,PlatformSettings[platform_name]);
	}
};

const ScriptGitHub = {

	'vars': {
		// Actual version of extension
		'VERSION': 310,

		'defaults': {
			'prefix_to_ignore': [
				'# ',
				'#	',
				'Merge',
				'Commits on ',
				'Feature/',
			],
			'pull_request_title': {
				// Placeholders: [BRANCH_SOURCE], [BRANCH_DESTINATION]
				'0': {'from': 'hotfix(.+)', 'to': '.+', 'title': 'Merge hotfix into [BRANCH_DESTINATION]'},
				'1': {'from': '.+', 'to': '.+', 'title': 'Merge "[BRANCH_SOURCE]" branch into [BRANCH_DESTINATION]'},
			}
		},
	},

	'capitalizeString': function( str ){
		return (str.charAt(0).toUpperCase() + str.slice(1));
	},

	'getSettings': function( callback ){
		if( typeof chrome !== 'undefined' ){
			chrome.storage.sync.get('settings', function( result ){
				let settings = {};
				if( typeof result.settings !== 'undefined' ){
					settings = JSON.parse(result.settings);
				}
				callback($.extend(true,{},ScriptGitHub.vars.defaults,settings));
			});
		}else{
			browser.storage.sync.get('settings').then(function( result ){
				let settings = {};
				if( typeof result.settings !== 'undefined' ){
					settings = JSON.parse(result.settings);
				}
				callback($.extend(true,{},ScriptGitHub.vars.defaults,settings));
			});
		}
	},

	'getBranchName': function( direction ){

		let $target;
		if( direction === 'to' ){
			$target = $('.range-cross-repo-pair').last();
		}else{
			$target = $('.range-cross-repo-pair').first();
		}

		return $target.find('.select-menu > .btn.branch > span').text();
	},

	'do': function( PlatformObject ){

		let actual_commits = [];
		$(PlatformObject.getCurrentCommitsList()).each((_, commit_message) => {
			for( let prefix of PlatformObject.prefix_to_ignore ){
				if( commit_message.startsWith(prefix) ){
					return;
				}
			}
			actual_commits.push(commit_message);
		});

		if( actual_commits.length === 0 ){
			return;
		}

		const BRANCH_SOURCE = PlatformObject.getBranchName('from');
		const BRANCH_DESTINATION = PlatformObject.getBranchName('to');

		$.each( PlatformObject.pull_request_title, function( _, item ){
			if( (item.title !== '') && (new RegExp(item.from,'i')).test(BRANCH_SOURCE) && (new RegExp(item.to,'i')).test(BRANCH_DESTINATION) ){
				PlatformObject.setPullRequestTitle(
					item.title
						// Replace placeholder
						.replaceAll('[BRANCH_SOURCE]',BRANCH_SOURCE)
						.replaceAll('[BRANCH_DESTINATION]',BRANCH_DESTINATION)
				);
				return false;
			}
		});

		let commits_results = {
			'added': {},
			'fixed': {},
			'removed': {},
			'deprecated': {},
		};

		for(let c in actual_commits){
			let commit_message = actual_commits[c];

			if( (typeof commit_message === 'undefined') || (commit_message === null) ){
				continue;
			}

			let key = PlatformObject.getSectionKey(commit_message);
			commits_results[key][ commit_message ] = ScriptGitHub.capitalizeString(commit_message);
		}

		let pull_request_text = '';

		for( let key in commits_results ){

			let commits_array = Object.values(commits_results[key]);

			if( commits_array.length === 0 ){
				continue;
			}

			commits_array.sort();

			pull_request_text += PlatformObject.buildCommitMessage(
				PlatformObject,
				ScriptGitHub.capitalizeString(key),
				commits_array
			);
		}

		PlatformObject.setPullRequestDescription(pull_request_text);
	}
};

$(function(){

	$('#js-repo-pjax-container').on('click','.range-cross-repo-pair .select-menu-item', function(){
		setTimeout(function(){
			location.reload();
		},300);
	});

	setTimeout(function(){
		ScriptGitHub.getSettings(function( settings ){
			ScriptGitHub.do(
				$.extend({},settings,PlatformSettings.get())
			);
		});
	},PlatformSettings.get().timer);

});
