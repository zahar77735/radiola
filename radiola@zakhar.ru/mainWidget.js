

const Main = imports.ui.main;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Clutter = imports.gi.Clutter;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Player = Me.imports.player;
const Settings = Me.imports.settings;
const AdSt = Me.imports.addStation;
const settings = Settings.settings;


const MAX_ENTRY_LENGTH = 40;
let iconPlay;
let iconStop;
let buttonIcon;
let playStopButton;
let playLabel;
let section;
let uri;

const RadioButton = GObject.registerClass(
	class RadioButton extends PanelMenu.Button {
		_init() {
			super._init(0.5);

			let icon = new St.Icon({
				style_class: 'system-status-icon',
				gicon: Gio.icon_new_for_string(Me.dir.get_path() + '/icons/net-radio-symbolic.svg')
			});

			this.add_child(icon);

			// init player
			this.player = null;

			this.playBox = new St.BoxLayout({
				name: 'playBox',
				vertical: true,
				width: 300,
			});
			this.menu.box.add_child(this.playBox);

			iconPlay = Gio.icon_new_for_string(Me.dir.get_path() + '/icons/play-symbolic.svg');

			iconStop = Gio.icon_new_for_string(Me.dir.get_path() + '/icons/stop-symbolic.svg');

			buttonIcon = new St.Icon({
				style_class: 'play-stop',
				gicon: iconPlay,
			});

			playStopButton = new St.Button({
				style_class: 'radio-menu-action',
				can_focus: true,
				child: buttonIcon,
				x_expand: true,
				y_expand: true,
				x_align: 2,
				y_align: 2,

			});

			playStopButton.connect('clicked', () => {
				if (buttonIcon.gicon === iconPlay) {
					this._play();
					buttonIcon.set_gicon(iconStop);
				}
				else {
					this._stop();
					buttonIcon.set_gicon(iconPlay);
				}
			});

			playLabel = new St.Label({
				text: "Radio",
				style_class: 'play-label'
			});

			this.playBox.add_child(playStopButton);
			this.playBox.add_child(playLabel);

			this.channelMenu = new PopupMenu.PopupSubMenuMenuItem('Channels');
			this.menu.addMenuItem(this.channelMenu);
			section = new PopupMenu.PopupMenuSection();
			this.channelMenu.menu.addMenuItem(section);

			this._makeItem();

			this.channelMenu.menu.connect('open-state-changed', () => {
				if (this.channelMenu.menu.isOpen) {
					this._makeItem();
				}
			});

			//--------------------

			//Кнопка добовления станций
			this.addButton = new St.Button({
				style_class: 'button',
				can_focus: true,
				x_align: 2,
				x_expand: true,
				y_expand: true
			});
			this.addButton.set_label("Add station");
			this.menu.box.add_child(this.addButton);

			this.addButton.connect('clicked', () => {
				this.menu.close();
				this.stDialog = new AdSt.AddStation();
				this.stDialog.open();
			});


		}


		_makeItem() {

			section.actor.remove_all_children();

			let num = 0;
			let a = 0;
			let arr = settings.get_strv("channel-name");
			let arrAddress = settings.get_strv("channel-address");
			let b = arr.length;

			while (num < b) {
				let text = arr[a];
				let address = arrAddress[a];

				let item = new PopupMenu.PopupMenuItem(this._truncate(text, MAX_ENTRY_LENGTH));
				item.connect('activate', () => {
					uri = address;
					if (buttonIcon.gicon == iconStop) {
						this._stop();
						this.player._changeChannel(uri);
						this._play();
					}
					else {
						//this.player._changeChannel(uri);
						//this.player._setup();
						this._play();
					}
					playLabel.set_text(text);
					log('Выбрана станция: ' + text);
					log('В базе ' + arr.length + ' станций.');
					if (buttonIcon.gicon == iconPlay) {
						buttonIcon.set_gicon(iconStop);
					}
				});
				section.actor.add_child(item);
				log('СОЗДАНО МЕНЮ С ИМЕНЕМ ' + item.label);
				let bicon = new St.Icon({
					icon_name: 'edit-delete-symbolic',
					style_class: 'system-status-icon'
				});
				let button = new St.Button({
					name: a.toString(),
					style_class: 'bicon',
					can_focus: true,
					child: bicon,
					x_align: Clutter.ActorAlign.END,
					x_expand: true,
					y_expand: true
				});
				item.add_child(button);
				log('СОЗДАНА КНОПКА С ИМЕНЕМ ' + button);
				button.connect('clicked', () => {
					let nb = +button.get_name();
					let n = nb + 1;
					item.destroy();
					playLabel.set_text('Radio');
					if (buttonIcon.gicon == iconStop) buttonIcon.set_gicon(iconPlay);
					log('Нажата кнопка номер: ' + n);
					arr.splice(nb, 1);
					arrAddress.splice(nb, 1);
					log('Осталось ' + arr.length + ' станций.');
					settings.set_strv("channel-name", arr);
					settings.set_strv("channel-address", arrAddress);
					log('База обновлена ');
				});

				a++;
				num++;
			}
		}

		_truncate(string, length) {
			let shortened = string.replace(/\s+/g, ' ');

			if (shortened.length > length)
				shortened = shortened.substring(0, length - 1) + '...';

			return shortened;
		}

		_play() {
			if (this.player === null) {
				this.player = new Player.Player(uri);
			}
			this.player._play();
			log('Запущен плеер с адресом :  ' + uri);
		}

		_stop() {
			if (this.player !== null) {
				this.player._stop();
				log('Плеер остановлен !');
			}
		}

	}
);

let radioButton;

function addToPanel() {
	radioButton = new RadioButton();
	Main.panel.addToStatusArea('radioButton', radioButton, 0, 'right');
}

function removeFromPanel() {
	radioButton.destroy();
}
