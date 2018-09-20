const CM_NAVIGATE = 'CM_NAVIGATE';
const CM_SET_UILANGUAGE = 'CM_SET_UILANGUAGE';
const CM_SET_SELECTION = 'CM_SET_SELECTION';
const CM_SET_PREVIEW = 'CM_SET_PREVIEW';

function setUiLang(uiLang) {
    return {
        type: CM_SET_UILANGUAGE,
        uiLang
    }
}

function cmSetSelection(selection) {
    return {
        type: CM_SET_SELECTION,
        selection
    }
}

function cmGoto(data) {
    return Object.assign(data || {}, {type: CM_NAVIGATE});
}

function cmSetSite(site) {
    return cmGoto({site});
}


function cmSetLanguage(language) {
    return cmGoto({language});
}

function cmSetMode(mode) {
    return cmGoto({mode});
}

function cmSetPath(path) {
    return cmGoto({path});
}

function cmSetParams(params) {
    return cmGoto({params});
}

function cmSetPreviewMode(mode) {
    return {
        type: CM_SET_PREVIEW,
        previewMode: mode
    }
}

function cmSetPreviewModes(modes) {
    return {
        type: CM_SET_PREVIEW,
        previewModes: modes
    }
}
export {
    CM_NAVIGATE,
    CM_SET_UILANGUAGE,
    CM_SET_SELECTION,
    CM_SET_PREVIEW,
    cmGoto,
    cmSetLanguage,
    setUiLang,
    cmSetSelection,
    cmSetSite,
    cmSetMode,
    cmSetPath,
    cmSetParams,
    cmSetPreviewMode,
    cmSetPreviewModes
}