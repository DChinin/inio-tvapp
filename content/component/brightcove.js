/**
 * `brightcove` component
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove
 * @extends Component
 */
(function(Component) {
	function Brightcove() {
		Component.apply(this, arguments);
	};

	Brightcove.prototype.__proto__ = Component.prototype;

	Brightcove.prototype.defaultAttributes = function() {
		return {
			endpoint: 'https://api.brightcove.com/services/library',
			token: ''
		};
	};

	/**
	 * Normalize video model
	 *
	 * @param {Object} attrs
	 * @return {Object}
	 */
	Brightcove.prototype.normalizeVideo = function(attrs) {
		var model = {
			id: attrs.id,
			title: attrs.name,
			coverImg: attrs.videoStillURL,
			thumbnail: attrs.thumbnailURL,
			description: attrs.longDescription,
			duration: attrs.length,
			videoUrl: attrs.HLSURL // 'http://techslides.com/demos/sample-videos/small.ogv'
		};

		if (attrs.customFields) {
			Content.extend(model, {
				actors: attrs.customFields.actors.split(/\,\s?/),
				directors: attrs.customFields.directors.split(/\,\s?/),
				countries: attrs.customFields.countries.split(/\,\s?/),
				parentalRating: attrs.customFields.parentalrating,
				rating: attrs.customFields.rating,
				year: attrs.customFields.year
			});

			if(attrs.customFields.tvserie){
				var tvserie = attrs.customFields.tvserie.split(/\,|\;/);
				model.tvShowEpisode = ('0'+tvserie[1]).slice(-2);
				model.tvShowSeason = ('0'+tvserie[0]).slice(-2);
			}
		}

		return new Content_Model_Video(model);
	};

	Content.registerComponent('brightcove', Brightcove);

})(Component);