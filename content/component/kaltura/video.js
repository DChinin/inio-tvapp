/**
 * `kaltura.video` component
 *
 * @author Mautilus s.r.o.
 * @class Component.kaltura.video
 * @extends Component
 */
(function(Component) {
	function Kaltura_Video() {
		Component.apply(this, arguments);
	};

	Kaltura_Video.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#init
	 */
	Kaltura_Video.prototype.init = function() {
		this.provider = Content.find('providers.kaltura');
		this.ready();
	};
	/**
	 * @inheritdoc Component#defaultAttributes
	 */
	Kaltura_Video.prototype.defaultAttributes = function() {
		return {};
	};
	/**
	 * @inheritdoc Component#normalize
	 */
	Kaltura_Video.prototype.normalize = function(attrs) {
		return this.provider.normalizeVideo.apply(this, arguments);
	};
	/**
	 * @inheritdoc Component#load
	 */
	Kaltura_Video.prototype.load = function(promise, videoId) {
		var objects, customData;

		if(! promise || !(promise instanceof Promise)){
			if(promise && ! videoId){
				videoId = promise;
			}

			promise = new Promise();
		}

		if(! this.provider.sessionId){
			this.provider.onReady(function(){
				this.load(promise, videoId);
			}, this);

			return promise;
		}

		this.all(Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				service: 'metadata_metadata',
				action: 'list',
				'filter:objectIdEqual': videoId,
				ks: this.provider.sessionId,
				format: 1
			}
		}).done(function(resp) {
			if(resp && resp.objects && resp.objects[0]){
				customData = this.provider.parseXML(resp.objects[0].xml);
			}

		}, this), Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				service: 'media',
				action: 'list',
				'filter:idEqual': videoId,
				ks: this.provider.sessionId,
				format: 1
			}
		}).done(function(resp) {
			if (resp && resp.objects) {
				objects = resp.objects;	
			}

		}, this)).done(function(){
			if (objects) {
				objects[0].customFields = customData;

				this.populate(objects).done(function() {
					promise.resolve();
				}, this);
				
			} else {
				// silent resolve
				promise.resolve();
			}

		}, this).fail(function(){
			// silent resolve
			promise.resolve();
		});

		return promise.done(function() {
			this.loaded = true;
		}, this);
	};

	Content.registerComponent('kaltura.video', Kaltura_Video);

})(Component);