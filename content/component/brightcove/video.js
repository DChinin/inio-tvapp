/**
 * `brightcove.video` component
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.video
 * @extends Component
 */
(function(Component) {
	function Brightcove_Video() {
		Component.apply(this, arguments);
	};

	Brightcove_Video.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#init
	 */
	Brightcove_Video.prototype.init = function() {
		this.provider = Content.find('providers.brightcove');
		this.ready();
	};
	/**
	 * @inheritdoc Component#defaultAttributes
	 */
	Brightcove_Video.prototype.defaultAttributes = function() {
		return {};
	};
	/**
	 * @inheritdoc Component#normalize
	 */
	Brightcove_Video.prototype.normalize = function(attrs) {
		return this.provider.normalizeVideo.apply(this, arguments);
	};
	/**
	 * @inheritdoc Component#load
	 */
	Brightcove_Video.prototype.load = function(videoId) {
		var promise = new Promise();

		Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				command: 'find_video_by_id',
				video_id: videoId,
				video_fields: 'id%2Cname%2CshortDescription%2ClongDescription%2CpublishedDate%2Ctags%2CcustomFields%2CvideoStillURL%2CthumbnailURL%2Clength%2CplaysTotal%2CplaysTrailingWeek%2CHLSURL',
				media_delivery: 'http_ios',
				token: this.provider.attr('token')
			}
		}).done(function(resp) {
			if (resp && resp.id) {
				this.populate([resp]).done(function() {
					promise.resolve();
				}, this);
				
			} else {
				// silent resolve
				promise.resolve();
			}
		}, this);

		return promise.done(function() {
			this.loaded = true;
		}, this);
	};


	Content.registerComponent('brightcove.video', Brightcove_Video);

})(Component);