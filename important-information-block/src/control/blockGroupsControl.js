import { ATTR_NAME_RECOMMENDATION_GROUPS, CONTROL_NAME_BLOCK_GROUPS } from '../const';
import baseControl from "./baseControl";

export default {
    ...baseControl,
    name: CONTROL_NAME_BLOCK_GROUPS,

    render() {
        this.options = this.getOptions();
        this.selectedGroups = this.getSelectedGroups();
        this.jContainer.html(this.getControlMarkup());
        this.dropDown = this.jContainer.find('dropdown-input')[0];
        this.updateSeparatorVisibility();
    },

    getOptions() {
        if (!this.getGroupsFromStripoConfig()) {
            return [];
        }
        return this.getGroupsFromStripoConfig().map(g => {
            return {
                value: g.id,
                label: g.name
            }
        });
    },

    getSelectedGroups() {
        //alert("etet -" + this.panelState.blockConfig.groups.length)
        if (this.panelState.blockConfig.groups == undefined || this.panelState.blockConfig.groups.length == 0) {
           //var defaultGroup = this.getGroupsFromStripoConfig().find(g => g.id == "0");
           console.log("Panel state block config group is blank.");
        }
        else {
            //console.log("GROUPww-" + this.panelState.blockConfig.groups);
            return (this.panelState.blockConfig.groups || []).map(g => g.id);
        }
    },

    updateSeparatorVisibility() {
        this.setControlsSeparatorVisible(!!this.jElement.attr(ATTR_NAME_RECOMMENDATION_GROUPS));
    },

    onChange(selectedGroupsId) {
        setTimeout(() => {
            var selectedGroup = this.getGroupsFromStripoConfig().find(g => g.id == selectedGroupsId);
            this.panelState.blockConfig.groups = [];
            this.panelState.blockConfig.groups.push(selectedGroup);
            this.panelState.blockConfig = this.extension
                .wrapBlockWithTypeIdentifierAttributesAndGetConfig(this.jElement, this.panelState.blockConfig);
            // this.updateLayout();
            this.updateBlockText(this.jElement, this.panelState.blockConfig);

            this.addBlockCustomAttibutes(this.jElement, "selectedBlocktypeuid", selectedGroup.id);
            this.addBlockCustomAttibutes(this.jElement, "selectedBlocktypename", selectedGroup.name.toLowerCase());
            this.addBlockCustomAttibutes(this.jElement, "selectedcontenttype", selectedGroup.contenttype.toLowerCase())

            this.applyChanges();
        }, 0);
    },

    getGroupsFromStripoConfig() {
        return this.extension.stripoConfig.blockConfiguration.groups;
    },

    layoutChanged() {
        if (this.isControlVisible()) {
            this.dropDown.props.value = this.getSelectedGroups();
        }
        this.updateControlVisibility();
        this.updateSeparatorVisibility();
    },

    getControlMarkup() {
        return `<div class="form-group">
            <div class="col-xs-4">
              Block Type
            </div>
            <div class="col-xs-8">
                <dropdown-input classes="custom-groups-picker"
                                buttonWrapperClasses="form-control"
                                optionTextClass="text"
                                globalScope = "${this.name}"
                                mbBindProp-values="options"
                                mbBindProp-value="selectedGroups"
                                mbBindProp-on-selected="onChange"
                                placeholder="${this.translate('settings.controls.groups.empty')}">                                       
                </dropdown-input>
            </div>
        </div>`;
    }
}