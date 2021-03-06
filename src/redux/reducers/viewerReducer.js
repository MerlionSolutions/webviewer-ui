export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'DISABLE_ELEMENT':
      return {
        ...state,
        disabledElements: {
          ...state.disabledElements,
          [payload.dataElement]: { disabled: true, priority: payload.priority },
        },
      };
    case 'DISABLE_ELEMENTS': {
      const disabledElements = {};
      payload.dataElements.forEach(dataElement => {
        disabledElements[dataElement] = {};
        disabledElements[dataElement].disabled = true;
        disabledElements[dataElement].priority = payload.priority;
      });

      return {
        ...state,
        disabledElements: { ...state.disabledElements, ...disabledElements },
      };
    }
    case 'ENABLE_ELEMENT':
      return {
        ...state,
        disabledElements: {
          ...state.disabledElements,
          [payload.dataElement]: {
            disabled: false,
            priority: payload.priority,
          },
        },
      };
    case 'ENABLE_ELEMENTS': {
      const disabledElements = {};
      payload.dataElements.forEach(dataElement => {
        disabledElements[dataElement] = {};
        disabledElements[dataElement].disabled = false;
        disabledElements[dataElement].priority = payload.priority;
      });

      return {
        ...state,
        disabledElements: { ...state.disabledElements, ...disabledElements },
      };
    }
    case 'ENABLE_ALL_ELEMENTS':
      return {
        ...state,
        disabledElements: { ...initialState.disabledElements },
      };
    case 'OPEN_ELEMENT':
      return {
        ...state,
        openElements: { ...state.openElements, [payload.dataElement]: true },
      };


    case 'OPEN_SIGNATURE_MODAL':
      return {
        ...state,
        openElements: {
          ...state.openElements,
          signatureOverlay: false,
          signatureModal: true
        },
        sigType: payload.type,
        clickedSigWidget: payload.clickedSigWidget,
        nextTool: payload.nextTool
      };

    case 'OPEN_SIGNATURE_OVERLAY':
      return {
        ...state,
        openElements: {
          ...state.openElements,
          signatureOverlay: true,
          signatureModal: false
        },
        sigType: payload.type
      };



    case 'HIDE_MESSAGE_MODAL':
      return {
        ...state,
        openElements: {
          ...state.openElements,
          messageModal: false
        },
        message: ''
      };

    case 'OPEN_MESSAGE_MODAL':
      return {
        ...state,
        openElements: {
          ...state.openElements,
          messageModal: true
        },
        message: payload.message
      };


    case 'CLOSE_ELEMENT':
      return {
        ...state,
        openElements: { ...state.openElements, [payload.dataElement]: false },
        nextTool: null
      };
    case 'SET_ACTIVE_HEADER_GROUP':
      return { ...state, activeHeaderGroup: payload.headerGroup };

    case 'REGISTER_HEADER_GROUP':
      return {
        ...state,
        headers: {
          ...state.headers,
          [payload.headerGroup]: payload.items
        }
      };



    case 'SET_ACTIVE_TOOL_NAME':
      return { ...state, activeToolName: payload.toolName };
    case 'SET_ACTIVE_TOOL_STYLES':
      return { ...state, activeToolStyles: { ...payload.toolStyles } };
    case 'SET_ACTIVE_TOOL_NAME_AND_STYLES':
      return {
        ...state,
        activeToolName: payload.toolName,
        activeToolStyles: payload.toolStyles,
      };
    case 'SET_ACTIVE_LEFT_PANEL':
      return { ...state, activeLeftPanel: payload.dataElement };
    case 'SET_ACTIVE_TOOL_GROUP':
      return { ...state, activeToolGroup: payload.toolGroup };
    case 'SET_NOTE_POPUP_ID':
      return { ...state, notePopupId: payload.id };
    case 'SET_NOTE_EDITING':
      return { ...state, isNoteEditing: payload.isNoteEditing };
    case 'SET_FIT_MODE':
      return { ...state, fitMode: payload.fitMode };
    case 'SET_ZOOM':
      return { ...state, zoom: payload.zoom };
    case 'SET_ROTATION':
      return { ...state, rotation: payload.rotation };
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: payload.displayMode };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: payload.currentPage };
    case 'SET_SORT_STRATEGY':
      return { ...state, sortStrategy: payload.sortStrategy };
    case 'SET_NOTE_DATE_FORMAT':
      return { ...state, noteDateFormat: payload.noteDateFormat };
    case 'SET_FULL_SCREEN':
      return { ...state, isFullScreen: payload.isFullScreen };
    case 'SET_HEADER_ITEMS':
      return {
        ...state,
        headers: { ...state.headers, [payload.header]: payload.headerItems },
      };
    case 'SET_POPUP_ITEMS':
      return {
        ...state,
        [payload.dataElement]: payload.items,
      };
    case 'REGISTER_TOOL':
      return {
        ...state,
        toolButtonObjects: {
          ...state.toolButtonObjects,
          [payload.toolName]: {
            dataElement: payload.buttonName,
            title: payload.tooltip,
            group: payload.buttonGroup,
            img: payload.buttonImage,
            showColor: 'active',
          },
        },
      };
    case 'UNREGISTER_TOOL': {
      const newToolButtonObjects = { ...state.toolButtonObjects };
      delete newToolButtonObjects[payload.toolName];
      return { ...state, toolButtonObjects: newToolButtonObjects };
    }
    case 'UPDATE_TOOL': {
      const { toolName, properties } = payload;
      const { buttonName, tooltip, buttonGroup, buttonImage } = properties;
      return {
        ...state,
        toolButtonObjects: {
          ...state.toolButtonObjects,
          [toolName]: {
            ...state.toolButtonObjects[toolName],
            dataElement:
              buttonName || state.toolButtonObjects[toolName].dataElement,
            title: tooltip || state.toolButtonObjects[toolName].title,
            group:
              buttonGroup !== undefined
                ? buttonGroup
                : state.toolButtonObjects[toolName].group,
            img: buttonImage || state.toolButtonObjects[toolName].img,
          },
        },
      };
    }
    case 'SET_THUMBNAIL_MERGING':
      return { ...state, isThumbnailMerging: payload.useThumbnailMerging };
    case 'SET_THUMBNAIL_REORDERING':
      return { ...state, isThumbnailReordering: payload.useThumbnailReordering };
    case 'SET_THUMBNAIL_MULTISELECT':
      return { ...state, isThumbnailMultiselect: payload.useThumbnailMultiselect };
    case 'SET_ALLOW_PAGE_NAVIGATION':
      return { ...state, allowPageNavigation: payload.allowPageNavigation };
    case 'SET_TOOL_BUTTON_OBJECTS':
      return { ...state, toolButtonObjects: { ...payload.toolButtonObjects } };
    case 'SET_READ_ONLY':
      return { ...state, isReadOnly: payload.isReadOnly };
    case 'SET_CUSTOM_PANEL':
      return {
        ...state,
        customPanels: [...state.customPanels, payload.newPanel],
      };
    case 'USE_EMBEDDED_PRINT':
      return { ...state, useEmbeddedPrint: payload.useEmbeddedPrint };
    case 'SET_PAGE_LABELS':
      return { ...state, pageLabels: [...payload.pageLabels] };
    case 'SET_SELECTED_THUMBNAIL_PAGE_INDEXES':
      return { ...state, selectedThumbnailPageIndexes: payload.selectedThumbnailPageIndexes };
    case 'REMOVE_PAGE_INDEX':
      return {
        ...state,
        selectedThumbnailPageIndexes: state.selectedThumbnailPageIndexes.filter(p => p !== payload.pageIndexDeleted).map(p => (p < payload.pageIndexDeleted ? p : p - 1)),
      };
    case 'SET_COLOR_PALETTE': {
      const { colorMapKey, colorPalette } = payload;
      return {
        ...state,
        colorMap: {
          ...state.colorMap,
          [colorMapKey]: {
            ...state.colorMap[colorMapKey],
            currentPalette: colorPalette,
          },
        },
      };
    }
    case 'SET_REPLY_DISABLED_FUNC': {
      const { func } = payload;
      return {
        ...state,
        isReplyDisabledFunc: func,
      };
    }
    case 'SET_ICON_COLOR': {
      const { colorMapKey, color } = payload;
      return {
        ...state,
        colorMap: {
          ...state.colorMap,
          [colorMapKey]: { ...state.colorMap[colorMapKey], iconColor: color },
        },
      };
    }
    case 'SET_COLOR_MAP':
      return { ...state, colorMap: payload.colorMap };
    case 'SET_WARNING_MESSAGE':
      return { ...state, warning: payload };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: payload.message };
    case 'SET_CUSTOM_NOTE_FILTER':
      return { ...state, customNoteFilter: payload.customNoteFilter };
    case 'SET_ZOOM_LIST':
      return { ...state, zoomList: payload.zoomList };
    case 'SET_MEASUREMENT_UNITS': {
      return { ...state, measurementUnits: payload };
    }
    case 'SET_LEFT_PANEL_WIDTH':
      return { ...state, leftPanelWidth: payload.width };
    case 'SET_MAX_SIGNATURES_COUNT':
      return { ...state, maxSignaturesCount: payload.maxSignaturesCount };
    case 'SET_CUSTOM_MEASUREMENT_OVERLAY':
      return { ...state, customMeasurementOverlay: payload.customMeasurementOverlay };
    case 'SET_SIGNATURE_FONTS':
      return { ...state, signatureFonts: payload.signatureFonts };
    case 'SET_SELECTED_TAB':
      return { ...state, tab: { ...state.tab, [payload.id]: payload.dataElement } };
    case 'SET_CUSTOM_ELEMENT_OVERRIDES':
      return { ...state, customElementOverrides: { ...state.customElementOverrides, [payload.dataElement]: payload.overrides } };
    case 'SET_NOTE_TRANSFORM_FUNCTION':
      return { ...state, noteTransformFunction: payload.noteTransformFunction };
    default:
      return state;
  }
};
