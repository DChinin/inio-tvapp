/**
 * `brightcove.playlist` component
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.playlist
 * @extends Component
 */
(function(Component) {
	function Brightcove_Playlist() {
		Component.apply(this, arguments);
	};

	Brightcove_Playlist.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#init
	 */
	Brightcove_Playlist.prototype.init = function() {
		this.provider = Content.find('providers.brightcove');
	};
	/**
	 * @inheritdoc Component#defaultAttributes
	 */
	Brightcove_Playlist.prototype.defaultAttributes = function() {
		return {};
	};
	/**
	 * @inheritdoc Component#normalize
	 */
	Brightcove_Playlist.prototype.normalize = function(attrs) {
		return this.provider.normalizeVideo.apply(this, arguments);
	};
	/**
	 * @inheritdoc Component#load
	 */
	Brightcove_Playlist.prototype.load = function(filterId) {
		var promise = new Promise();

		Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				command: 'find_playlist_by_id',
				playlist_id: filterId,
				playlist_fields: 'id%2Cname%2Cvideos%2CvideoIds',
				video_fields: 'id%2Cname%2ClongDescription%2CcustomFields%2CvideoStillURL%2CthumbnailURL%2Clength%2CHLSURL',
				media_delivery: 'http_ios',
				token: this.provider.attr('token')
			}
		}).done(function(resp) {
			if (resp && resp.videos) {
				this.populate(resp.videos).done(function() {
					promise.resolve();
				}, this);
			}
		}, this);

		return promise.done(function() {
			this.loaded = true;
		}, this);
	};

	Content.registerComponent('brightcove.playlist', Brightcove_Playlist);

})(Component);