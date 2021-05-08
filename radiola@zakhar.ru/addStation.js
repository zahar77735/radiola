
const Main = imports.ui.main;
const St = imports.gi.St;
const GObject = imports.gi.GObject;
const ModalDialog = imports.ui.modalDialog;
const Clutter = imports.gi.Clutter;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const Widget = Me.imports.mainWidget;





var AddStation = GObject.registerClass(
	class AddStation extends ModalDialog.ModalDialog {

		_init() {
			super._init({
				styleClass: 'run-dialog',
			});
			this._viewDialog();
		}

		_viewDialog() {
			let settings = Settings.settings;
			let arrName = settings.get_strv("channel-name");
			let arrAddress = settings.get_strv("channel-address");

			//общий контейнер
			let buildDialog = new St.BoxLayout({
				name: 'viewDialog',
				vertical: true,
				can_focus: true
			});
			this.contentLayout.add_actor(buildDialog);
			//контейнер для добавления названия станции
			let nameStation = new St.BoxLayout({
				name: 'nameStation',
				style_class: 'station-dialog',
				vertical: true,
				can_focus: true
			});
			buildDialog.add_actor(nameStation);

			let nameStationLabel = new St.Label({
				text: "Add name station",
				style_class: 'station-label'
			});
			nameStation.add_actor(nameStationLabel);

			let nameStationEntry = new St.Entry({
				style_class: 'station-entry',
				can_focus: true,
				track_hover: true,
				hint_text: "Enter name station...",
				x_expand: true,
				y_expand: true
			});
			nameStation.add_actor(nameStationEntry);

			//контейнер для добавления адреа станции
			let addressStation = new St.BoxLayout({
				name: 'addressStation',
				style_class: 'station-dialog',
				vertical: true,
			});
			buildDialog.add_actor(addressStation);

			let addressStationLabel = new St.Label({
				text: "Add address station",
				style_class: 'station-label'
			});
			addressStation.add_actor(addressStationLabel);

			let addressStationEntry = new St.Entry({
				style_class: 'station-entry',
				can_focus: true,
				track_hover: true,
				hint_text: "Enter address station...",
				x_expand: true,
				y_expand: true
			});
			addressStation.add_actor(addressStationEntry);

			//контейнер для кнопок
			let buttonBox = new St.BoxLayout({
				name: 'buttonBox',
				style_class: 'button-box',
				can_focus: true,
				x_align: 2,
				y_align: 3,
				x_expand: true,
				y_expand: true
			});
			buildDialog.add_actor(buttonBox);

			let createButton = new St.Button({
				style_class: 'button',
				can_focus: true,
			});
			createButton.set_label("Create");
			buttonBox.add_actor(createButton);

			let closeButton = new St.Button({
				style_class: 'button',
				can_focus: true,
			});
			closeButton.set_label("Close");
			buttonBox.add_actor(closeButton);

			log('ФОКУС:    ' + global.stage.get_key_focus());

			nameStationEntry.connect('key-press-event', (x, event) => {
				//const control = (event.get_state() & Clutter.ModifierType.CONTROL_MASK) !== 0;
				//const shift = (event.get_state() & Clutter.ModifierType.SHIFT_MASK) !== 0;
				const symbol = event.get_key_symbol();
				if (symbol === Clutter.KEY_Escape) {
					this._closeDialog();
				}
			});

			addressStationEntry.connect('key-press-event', (x, event) => {
				const symbol = event.get_key_symbol();
				if (symbol === Clutter.KEY_Escape) {
					this._closeDialog();
				}
			});

			closeButton.connect('clicked', () => {
				log('clicked button');
				this._closeDialog();
			});

			let textName;
			let textAddress;

			nameStationEntry.get_clutter_text().connect('text-changed', () => {
				textName = nameStationEntry.get_text();
			});

			addressStationEntry.get_clutter_text().connect('text-changed', () => {
				textAddress = addressStationEntry.get_text();
			});

			createButton.connect('clicked', () => {
				if (typeof textAddress === 'string') {
					if (typeof textName === 'string') {
						arrName.push(textName);
						arrAddress.push(textAddress);
						settings.set_strv("channel-name", arrName);
						settings.set_strv("channel-address", arrAddress);
						log('Название :' + textName);
						log('Адрес :' + textAddress);
						this._closeDialog();
					}
				}
			});


		}

		_closeDialog() {
			this.close();
		}

	}

);

