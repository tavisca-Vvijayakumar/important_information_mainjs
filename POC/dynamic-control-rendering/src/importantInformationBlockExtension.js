import {
    ATTR_NAME_BLOCK_CONFIGURATION,
    ATTR_NAME_RECOMMENDATION_GROUPS,
    BLOCK_UNIQUE_CLASS_NAME,
    CONTROL_NAME_BLOCK_GROUPS,
    PRODUCT_BLOCK_EMPTY_CLASS,
    CONTROL_NAME_BLOCK_TEXT,
    CONTROL_NAME_CARDS_IN_ROW_COUNT,
    EVENT_NAME_LAYOUT_CHANGED
} from './const.js';
import translations from "./translations.js";
import blockGroupsControl from "./control/blockGroupsControl.js";
import blockTextControl from "./control/blockTextControl.js";
import cardsInRowCountControl from "./control/cardsInRowCountControl.js";
import { createBlockConfigurationService } from "./blockConfiguration.js";
import defaultLayout from "./layout/defaultLayout.html";

export function createImportantInformationBlockExtension(stripoConfig, stripoApi, extensionBasePath) {

    var index = 1;
    const blockConfigurationService = createBlockConfigurationService(stripoConfig, stripoApi);

    function isEnabled() {
        return stripoConfig.blockConfiguration && stripoConfig.blockConfiguration.enabled;
    }

    function emailInitialized(emailBody) {
    }

    function blockDropped(block) {
    }

    function updateLayout(jStructure, blockConfig) {
        stripoApi.triggerEvent(EVENT_NAME_LAYOUT_CHANGED);
    }

    function updateBlockText(element, blockConfiguration) {
        if (blockConfiguration === undefined) {
            throw new Error("Group selected cannot be undefined.");
        }

        element[0].querySelector('.custom-block-text > p').innerHTML = blockConfiguration.groups[0].placeholder;
    }

    function addBlockCustomAttibutes(element, key, value) {
        if (element[0].querySelector('.custom-block-text').hasAttribute(key)) {
            element[0].querySelector('.custom-block-text').removeAttribute(key);
        }
        element[0].querySelector('.custom-block-text').setAttribute(key, value);
    }

    function wrapBlockWithTypeIdentifierAttributesAndGetConfig(block, blockConfig) {
        if (!blockConfig) {
            blockConfig = blockConfigurationService.getBlockConfiguration(block) || {};
        }
        const updatedConfig = blockConfigurationService.getOrCreateConfig(blockConfig);
        if (updatedConfig.groups.length) {
            block
                .attr(ATTR_NAME_RECOMMENDATION_GROUPS, updatedConfig.groups.map(g => g.id).join(','))
                .removeClass(PRODUCT_BLOCK_EMPTY_CLASS);
        } else {
            block
                .removeAttr(ATTR_NAME_RECOMMENDATION_GROUPS)
                .addClass(PRODUCT_BLOCK_EMPTY_CLASS);
        }
        blockConfigurationService.setBlockConfiguration(block, updatedConfig);
        return updatedConfig;
    }

    function getDefaultLayout() {
        return defaultLayout.replace(/#SELECT_BLOCK#/g, stripoApi.translate('preview.empty.description'));
    }

    function getBlockLayoutToDrop() {
        if (!isEnabled()) {
            return;
        }
        const element = stripoApi.jQuery(getDefaultLayout());
        wrapBlockWithTypeIdentifierAttributesAndGetConfig(element);
        return element[0].outerHTML;
    }

    function getBlockLabel(block) {
        const blockConfiguration = blockConfigurationService.getBlockConfiguration(block);
        return blockConfiguration.groups.map(g => g.name).join(', ') || stripoApi.translate('preview.empty.description');
    }

    function getDefaultSettingsPanelState(block) {
        return {
            blockConfig: blockConfigurationService.getBlockConfiguration(block)
        }
    }

    function onBlockCopy(sourceBlock, targetBlock) {
        let blockConfig = blockConfigurationService.getBlockConfigurationForCopiedBlock(targetBlock);
        blockConfig = wrapBlockWithTypeIdentifierAttributesAndGetConfig(targetBlock, blockConfig);
        updateLayout(targetBlock, blockConfig);
    }

    return {
        name: 'CustomBlocks',
        iconClass: 'es-icon-product',
        uniqueClassName: BLOCK_UNIQUE_CLASS_NAME,
        canBeSavedToLibrary: true,
        settingsCssPath: '/assets/css/settings.css',
        previewCssPath: '/assets/css/preview.css',
        i18n: translations,
        blockName: 'block.name',
        emptyContainerIcon: true,
        blockType: 'multi-orientation',
        blockConfigAttributeNames: [
            ATTR_NAME_BLOCK_CONFIGURATION
        ],
        controlsToCreate: [
            { control: blockTextControl },
            { control: blockGroupsControl },
            { control: cardsInRowCountControl},
        ],
        blockControls: [
            CONTROL_NAME_BLOCK_TEXT,
            CONTROL_NAME_BLOCK_GROUPS,
            CONTROL_NAME_CARDS_IN_ROW_COUNT,
        ],

        emailInitialized,
        getBlockLayoutToDrop,
        blockDropped,
        getBlockLabel,
        getDefaultSettingsPanelState,
        onBlockCopy,
        updateLayout,
        wrapBlockWithTypeIdentifierAttributesAndGetConfig,
        updateBlockText,
        addBlockCustomAttibutes,
        blockConfigurationService
    }
}
