/**
 * `brightcove.filter` component
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.filter
 * @extends Component
 */
(function(Component) {
	function Brightcove_Filter() {
		Component.apply(this, arguments);
	};

	Brightcove_Filter.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#init
	 */
	Brightcove_Filter.prototype.init = function() {
		this.provider = Content.find('providers.brightcove');
		this.ready();
	};
	/**
	 * @inheritdoc Component#defaultAttributes
	 */
	Brightcove_Filter.prototype.defaultAttributes = function() {
		return {
			tvshows: false
		};
	};
	/**
	 * @inheritdoc Component#normalize
	 */
	Brightcove_Filter.prototype.normalize = function(attrs) {
		return new Content_Model_Filter(attrs);
	};
	/**
	 * @inheritdoc Component#load
	 */
	Brightcove_Filter.prototype.load = function() {
		var promise = new Promise(), tvshows = this.attr('tvshows');

		Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				command: 'find_all_playlists',
				page_size: 99,
				page_number: 0,
				get_item_count: true,
				playlist_fields: 'id%2Cname%2CreferenceId%2CthumbnailURL',
				token: this.provider.attr('token')
			}
		}).done(function(resp) {
			if (resp && resp.items) {
				var items = [];

				for (var i in resp.items) {
					if (resp.items[i] && ((! tvshows && !/^tvserie/.test(resp.items[i].referenceId)) || (tvshows && /^tvserie/.test(resp.items[i].referenceId)))) {
						items.push({
							id: resp.items[i].id,
							title: resp.items[i].name,
							coverImg: resp.items[i].thumbnailURL || '',
							_raw: resp.items[i]
						});
					}
				}

				this.populate(items).done(function() {
					promise.resolve();
				}, this);
				
			} else {
				// silent resolve
				promise.resolve();
			}
		}, this).fail(function(err, resp, headers){
			promise.reject(err, resp, headers);
		});

		return promise.done(function() {
			this.loaded = true;
		}, this);
	};

	Content.registerComponent('brightcove.filter', Brightcove_Filter);

})(Component);