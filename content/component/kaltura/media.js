/**
 * `kaltura.media` component
 *
 * @author Mautilus s.r.o.
 * @class Component.kaltura.media
 * @extends Component
 */
(function(Component) {
	function Kaltura_Media() {
		Component.apply(this, arguments);
	};

	Kaltura_Media.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#init
	 */
	Kaltura_Media.prototype.init = function() {
		this.provider = Content.find('providers.kaltura');
		this.ready();
	};
	/**
	 * @inheritdoc Component#defaultAttributes
	 */
	Kaltura_Media.prototype.defaultAttributes = function() {
		return {};
	};
	/**
	 * @inheritdoc Component#normalize
	 */
	Kaltura_Media.prototype.normalize = function(attrs) {
		return this.provider.normalizeVideo.apply(this, arguments);
	};
	/**
	 * @inheritdoc Component#load
	 */
	Kaltura_Media.prototype.load = function(promise, filterId) {
		if(! promise || !(promise instanceof Promise)){
			if(promise && ! filterId){
				filterId = promise;
			}

			promise = new Promise();
		}

		if(! this.provider.sessionId){
			this.provider.onReady(function(){
				this.load(promise, filterId);
			}, this);

			return promise;
		}

		if(this.filterId === filterId){
			promise.resolve();

			return promise.done(function() {
				this.loaded = true;
			}, this);
		}

		this.filterId = filterId;

		Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				service: 'media',
				action: 'list',
				'filter:categoriesIdsMatchOr': filterId,
				ks: this.provider.sessionId,
				format: 1
			}
		}).done(function(resp) {
			if (resp && resp.objects) {
				this.populate(resp.objects).done(function() {
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

	Content.registerComponent('kaltura.media', Kaltura_Media);

})(Component);