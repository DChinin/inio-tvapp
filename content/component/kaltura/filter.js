/**
 * `kaltura.filter` component
 *
 * @author Mautilus s.r.o.
 * @class Component.kaltura.filter
 * @extends Component
 */
(function(Component) {
	function Kaltura_Filter() {
		Component.apply(this, arguments);
	};

	Kaltura_Filter.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#init
	 */
	Kaltura_Filter.prototype.init = function() {
		this.provider = Content.find('providers.kaltura');
		this.ready();
	};
	/**
	 * @inheritdoc Component#defaultAttributes
	 */
	Kaltura_Filter.prototype.defaultAttributes = function() {
		return {
			parentIdEqual: null
		};
	};
	/**
	 * @inheritdoc Component#normalize
	 */
	Kaltura_Filter.prototype.normalize = function(attrs) {
		return new Content_Model_Filter(attrs);
	};
	/**
	 * @inheritdoc Component#load
	 */
	Kaltura_Filter.prototype.load = function(promise) {
		if(! promise){
			promise = new Promise();
		}

		if(! this.provider.sessionId){
			this.provider.onReady(function(){
				this.load(promise);
			}, this);

			return promise;
		}

		Content.ajax(this.provider.attr('endpoint'), {
			type: 'json',
			data: {
				service: 'category',
				action: 'list',
				'filter:parentIdEqual': this.attr('parentIdEqual'),
				ks: this.provider.sessionId,
				format: 1
			}
		}).done(function(resp) {
			if (resp && resp.objects) {
				var items = [];

				for (var i in resp.objects) {
					if (resp.objects[i]) {
						items.push({
							id: resp.objects[i].id,
							title: resp.objects[i].name,
							_raw: resp.objects[i]
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
		}, this);

		return promise.done(function() {
			this.loaded = true;
		}, this);
	};

	Content.registerComponent('kaltura.filter', Kaltura_Filter);

})(Component);