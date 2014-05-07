/**
 * Events + Deferrable
 *
 * @author Mautilus s.r.o.
 * @class EventsDeferrable
 * @abstract
 */
function EventsDeferrable() {
	Events.call(this);
	Deferrable.call(this);
};

Inio.extend(EventsDeferrable.prototype, Events.prototype, Deferrable.prototype);