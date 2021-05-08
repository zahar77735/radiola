
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Widget = Me.imports.mainWidget;


function init() {

}

function enable() {
	Widget.addToPanel();
}

function disable() {
	Widget.removeFromPanel();
}