/**
 * `brightcove.search` component
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.search
 * @extends Component
 */
(function(Component) {
	function Brightcove_Search() {
		Component.apply(this, arguments);
	};

	Brightcove_Search.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#init
	 */
	Brightcove_Search.prototype.init = function() {
		this.provider = Content.find('providers.brightcove');
		this.ready();
	};
	/**
	 * @inheritdoc Component#defaultAttributes
	 */
	Brightcove_Search.prototype.defaultAttributes = function() {
		return {
			'all': '',
			'any': '',
			'none': '',
			'sort_by': 'DISPLAY_NAME:ASC',
			'page_size': 99
		};
	};
	/**
	 * @inheritdoc Component#normalize
	 */
	Brightcove_Search.prototype.normalize = function(attrs) {
		return this.provider.normalizeVideo.apply(this, arguments);
	};
	/**
	 * @inheritdoc Component#load
	 */
	Brightcove_Search.prototype.load = function(filterId) {
		var promise = new Promise();

		Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				command: 'search_videos',
				all: this.attr('all'),
				any: this.attr('any'),
				none: this.attr('none'),
				video_fields: 'id%2Cname%2ClongDescription%2CcustomFields%2CvideoStillURL%2CthumbnailURL%2Clength%2CHLSURL',
				media_delivery: 'http_ios',
				sort_by: this.attr('sort_by'),
				page_size: this.attr('page_size'),
				token: this.provider.attr('token')
			}
		}).done(function(resp) {
			if (resp && resp.items) {
				this.populate(resp.items).done(function() {
					promise.resolve();
				}, this);
				
			}  else {
				// silent resolve
				promise.resolve();
			}
		}, this);

		return promise.done(function() {
			this.loaded = true;
		}, this);
	};

	Content.registerComponent('brightcove.search', Brightcove_Search);

})(Component);