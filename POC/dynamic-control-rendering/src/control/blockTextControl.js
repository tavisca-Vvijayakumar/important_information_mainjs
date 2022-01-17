import { CONTROL_NAME_BLOCK_TEXT } from '../const';
import baseControl from "./baseControl";

export default {
    ...baseControl,
    name: CONTROL_NAME_BLOCK_TEXT,

    render() {
        this.jContainer.html(this.getControlMarkup());
        var textControl = this.jContainer[0].querySelector('#txtTitle');
        textControl.value = this.panelState.blockConfig.propertyText;
        textControl.addEventListener('keyup', function (e) {
            this.onTextChange(e, textControl);
        }.bind(this));
    },

    onTextChange(e, textControl) {
        this.panelState.blockConfig.propertyText = textControl.value;
        this.panelState.blockConfig = this.extension
            .wrapBlockWithTypeIdentifierAttributesAndGetConfig(this.jElement, this.panelState.blockConfig);
        this.addBlockCustomAttibutes(this.jElement, "BlockTitle", this.panelState.blockConfig.propertyText);
        this.applyChanges();
    },

    layoutChanged() {
        console.log("Textboxlayoutchanged called");
        if (this.isControlVisible()) {
            console.log("Textboxlayoutchanged called inside");
            //this.numberSelector.props.value = this.panelState.blockConfig.rowCount;
        }
        this.updateControlVisibility();
    },

    getControlMarkup() {
        return `<div class="form-group">
            <div class="col-xs-4">
              Title
            </div>
            <div class="col-xs-8">
                <input classes="form-control" style="width: 98%"
                                id="txtTitle"
                                buttonWrapperClasses="form-control"
                                optionTextClass="text"
                                globalScope = "${this.name}"
                                type="text"
                                value="TEst"
                                placeholder="${this.translate('settings.controls.text-title.empty')}">                                       
                </input>
            </div>
        </div>`;
    },

    isControlVisible() {
        return this.isValuableBlock() && this.panelState.blockConfig.groups[0].name == 'Header';
    }
}

