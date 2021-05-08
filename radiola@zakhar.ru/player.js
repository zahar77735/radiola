imports.gi.versions.Gst = '1.0';

const Gst = imports.gi.Gst;
const Me = imports.misc.extensionUtils.getCurrentExtension();


var Player = class Player {

	constructor(channel) {
		Gst.init(null);

		this._currentChannel = channel;
		this._setup();
	}

	_setup() {
		this._player = Gst.ElementFactory.make('playbin', 'player');
		this._player.set_property('uri', this._currentChannel);
	}

	_play() {
		this._player.set_state(Gst.State.PLAYING);
	}

	_stop() {
		this._player.set_state(Gst.State.NULL);
	}

	_changeChannel(channel) {
		if (this._player === null) {
			this._setup();
		}
		else {
			this._stop();
			this._currentChannel = channel;
			this._setup();
			log('настройка нового плеера с адресом : ' + this._currentChannel);
		}
	}
};