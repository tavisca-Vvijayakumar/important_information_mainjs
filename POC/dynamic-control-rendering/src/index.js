import stripoDefaultExtension from './stripoDefaultExtension.js';
import {createImportantInformationBlockExtension} from './importantInformationBlockExtension.js';

const extension = {
    create(stripoConfig, stripoApi, extensionBasePath) {
        return Object.assign({
            stripoConfig: stripoConfig,
            stripoApi: stripoApi,
            extensionBasePath: extensionBasePath,
            ...stripoDefaultExtension,
            ...createImportantInformationBlockExtension(stripoConfig, stripoApi, extensionBasePath)
        });
    }
};

self['CustomBlockExtension'] = extension;