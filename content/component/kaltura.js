/**
 * `kaltura` component
 *
 * @author Mautilus s.r.o.
 * @class Component.kaltura
 * @extends Component
 */
(function(Component) {
	function Kaltura() {
		this.sessionId = null;

		Component.apply(this, arguments);
	};

	Kaltura.prototype.__proto__ = Component.prototype;

	Kaltura.prototype.defaultAttributes = function() {
		return {
			endpoint: 'https://www.kaltura.com/api_v3',
			partnerId: '',
			userId: 'public@mautilus.com',
			userSecret: ''
		};
	};

	Kaltura.prototype.init = function() {
		Content.ajax(this.attr('endpoint'), {
			type: 'json',
			data: {
				service: 'session',
				action: 'start',
				partnerId: this.attr('partnerId'),
				//userId: this.attr('userId'),
				secret: this.attr('userSecret'),
				format: 1
			}
		}).done(function(resp) {
			if (resp && typeof resp === 'string') {
				this.sessionId = resp;

				// call onReady callbacks
				this.ready();

			} else if (resp && resp.message) {
				throw new Error(resp.message);

			} else {
				throw new Error('Invalid response');
			}
		}, this);
	};

	/**
	 * Normalize video model
	 *
	 * @param {Object} attrs
	 * @return {Object}
	 */
	Kaltura.prototype.normalizeVideo = function(attrs) {
		var model = {
			id: attrs.id,
			title: attrs.name,
			coverImg: attrs.thumbnailUrl,
			thumbnail: attrs.thumbnailUrl,
			description: attrs.description,
			duration: attrs.msDuration,
			videoUrl: attrs.dataUrl
		};

		model.videoUrl = this.provider.getHLS(attrs);
		model.thumbnail = this.provider.getTumbnail(attrs, 178);
		model.coverImg = this.provider.getTumbnail(attrs, 178);

		if (attrs.customFields) {
			Content.extend(model, {
				actors: (attrs.customFields.actors || '').split(/\,\s?/),
				directors: (attrs.customFields.directors || '').split(/\,\s?/),
				countries: (attrs.customFields.countries || '').split(/\,\s?/),
				parentalRating: attrs.customFields.parentalrating,
				rating: attrs.customFields.rating,
				year: attrs.customFields.year
			});
		}

		return new Content_Model_Video(model);
	};

	Kaltura.prototype.getTumbnail = function(model, width) {
		return model.thumbnailUrl + '/width/'+width;
	};

	Kaltura.prototype.getHLS = function(model) {
		return 'https://www.kaltura.com/p/' + this.attr('partnerId') + '/sp/0/playManifest/entryId/' + model.id + '/flavorIds/301961/format/applehttp/protocol/http/a.m3u8?ks=' + this.sessionId;
	};

	Kaltura.prototype.parseXML = function(xml) {
		var rexp = '<(\\w+)>(.*)</', data = {}, m, n, k;

		m = xml.match(new RegExp(rexp, 'g'));

		if(m){
			for(var i in m){
				n = m[i].match(new RegExp(rexp));

				if(n){
					k = n[1].toLowerCase();

					if(data[k]){
						data[k] += ','+ (n[2] || '');

					} else {
						data[k] = n[2] || '';
					}
				}
			}
		}

		return data;
	};

	Content.registerComponent('kaltura', Kaltura);

})(Component);