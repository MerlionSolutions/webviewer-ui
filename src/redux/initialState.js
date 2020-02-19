import React from 'react';

import ToggleZoomOverlay from 'components/ToggleZoomOverlay';
import SignatureToolButton from 'components/SignatureToolButton';

import core from 'core';
import getHashParams from 'helpers/getHashParams';
import { zoomIn, zoomOut } from 'helpers/zoom';
import defaultTool from 'constants/defaultTool';
import { copyMapWithDataProperties } from 'constants/map';
import actions from 'actions';

export default {
  viewer: {
    disabledElements: {},
    message: '',
    sigType: '',
    clickedSigWidget: '',
    openElements: {
      header: true,
      progressModal: false,
      messageModal: false,
    },
    headers: {
      default: [
        { type: 'toggleElementButton', img: 'ic_left_sidebar_black_24px', element: 'leftPanel', dataElement: 'leftPanelButton', title: 'component.leftPanel' },
        { type: 'divider', hidden: ['tablet', 'mobile'] },
        { type: 'toggleElementButton', img: 'ic_viewer_settings_black_24px', element: 'viewControlsOverlay', dataElement: 'viewControlsButton', title: 'component.viewControlsOverlay' },
        { type: 'toolButton', toolName: 'Pan' },
        { type: 'toolButton', toolName: 'TextSelect' },
        { type: 'toolButton', toolName: 'AnnotationEdit', hidden: ['tablet', 'mobile'] },
        { type: 'actionButton', img: 'ic_zoom_out_black_24px', onClick: zoomOut, title: 'action.zoomOut', dataElement: 'zoomOutButton', hidden: ['mobile'] },
        { type: 'actionButton', img: 'ic_zoom_in_black_24px', onClick: zoomIn, title: 'action.zoomIn', dataElement: 'zoomInButton', hidden: ['mobile'] },
        {
          type: 'customElement',
          render: () => <ToggleZoomOverlay />,
          dataElement: 'zoomOverlayButton',
          hidden: ['mobile'],
          element: 'zoomOverlay',
        },
        { type: 'spacer' },
        { type: 'toolGroupButton', toolGroup: 'measurementTools', dataElement: 'measurementToolGroupButton', title: 'component.measurementToolsButton', hidden: ['tablet', 'mobile'] },
        { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'component.freehandToolsButton', hidden: ['tablet', 'mobile'] },
        { type: 'toolGroupButton', toolGroup: 'textTools', dataElement: 'textToolGroupButton', title: 'component.textToolsButton', hidden: ['tablet', 'mobile'] },
        { type: 'toolGroupButton', toolGroup: 'shapeTools', dataElement: 'shapeToolGroupButton', title: 'component.shapeToolsButton', hidden: ['tablet', 'mobile'] },
        { type: 'toolButton', toolName: 'AnnotationEraserTool', hidden: ['tablet', 'mobile'] },
        {
          type: 'customElement',
          render: () => <SignatureToolButton />,
          dataElement: 'signatureToolButton',
          hidden: ['tablet', 'mobile'],
        },
        // TODO: change this button to be a custom element so we don't need to have extra logic in ToggleElementButton.js to determine if the button should be highlighted
        { type: 'toggleElementButton', className: 'redactHeader', dataElement: 'redactionButton', element: 'redactionOverlay', img: 'ic_annotation_add_redact_black_24px', title: 'component.redaction', hidden: ['tablet', 'mobile'] },
        { type: 'toolButton', toolName: 'AnnotationCreateFreeText', hidden: ['tablet', 'mobile'] },
        { type: 'toolButton', toolName: 'AnnotationCreateSticky', hidden: ['tablet', 'mobile'] },
        { type: 'toolGroupButton', toolGroup: 'miscTools', img: 'ic_more_black_24px', dataElement: 'miscToolGroupButton', title: 'component.miscToolsButton', hidden: ['tablet', 'mobile'] },
        {
          type: 'actionButton',
          img: 'ic_edit_black_24px',
          onClick: dispatch => {
            dispatch(actions.setActiveHeaderGroup('tools'));
            core.setToolMode(defaultTool);
            dispatch(actions.closeElements(['viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'searchPanel', 'leftPanel', 'zoomOverlay', 'redactionOverlay']));
          },
          dataElement: 'toolsButton',
          title: 'component.toolsButton',
          hidden: ['desktop'],
        },
        { type: 'divider', hidden: ['tablet', 'mobile'] },
        { type: 'toggleElementButton', dataElement: 'searchButton', element: 'searchOverlay', img: 'ic_search_black_24px', title: 'component.searchOverlay' },
        { type: 'toggleElementButton', dataElement: 'menuButton', element: 'menuOverlay', img: 'ic_overflow_black_24px', title: 'component.menuOverlay' },
      ],
      tools: [
        { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'component.freehandToolsButton' },
        { type: 'toolGroupButton', toolGroup: 'textTools', dataElement: 'textToolGroupButton', title: 'component.textToolsButton' },
        { type: 'toolGroupButton', toolGroup: 'shapeTools', dataElement: 'shapeToolGroupButton', title: 'component.shapeToolsButton' },
        {
          type: 'customElement',
          render: () => <SignatureToolButton />,
          dataElement: 'signatureToolButton',
        },
        { type: 'toolGroupButton', toolGroup: 'measurementTools', dataElement: 'measurementToolGroupButton', title: 'component.measurementToolsButton' },
        { type: 'toggleElementButton', toolName: 'AnnotationCreateRedaction', className: 'redactHeader', dataElement: 'redactionButton', element: 'redactionOverlay', img: 'ic_annotation_add_redact_black_24px', title: 'component.redaction' },
        { type: 'toolButton', toolName: 'AnnotationCreateFreeText' },
        { type: 'toolButton', toolName: 'AnnotationCreateSticky' },
        { type: 'toolButton', toolName: 'AnnotationEraserTool' },
        { type: 'toolGroupButton', toolGroup: 'miscTools', img: 'ic_more_black_24px', dataElement: 'miscToolGroupButton', title: 'component.miscToolsButton' },
        { type: 'spacer' },
        {
          type: 'actionButton',
          dataElement: 'defaultHeaderButton',
          titile: 'action.close',
          img: 'ic_close_black_24px',
          onClick: dispatch => {
            dispatch(actions.setActiveHeaderGroup('default'));
            core.setToolMode(defaultTool);
            dispatch(actions.closeElements(['viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'searchPanel', 'leftPanel', 'redactionOverlay']));
          },
        },
      ],
    },
    annotationPopup: [
      { dataElement: 'annotationCommentButton' },
      { dataElement: 'annotationStyleEditButton' },
      { dataElement: 'annotationRedactButton' },
      { dataElement: 'annotationCropButton' },
      { dataElement: 'annotationGroupButton' },
      { dataElement: 'annotationUngroupButton' },
      { dataElement: 'annotationDeleteButton' },
      { dataElement: 'calibrateButton' },
      { dataElement: 'linkButton' },
      { dataElement: 'fileAttachmentDownload' },
    ],
    textPopup: [
      { dataElement: 'copyTextButton' },
      { dataElement: 'textHighlightToolButton' },
      { dataElement: 'textUnderlineToolButton' },
      { dataElement: 'textSquigglyToolButton' },
      { dataElement: 'textStrikeoutToolButton' },
      { dataElement: 'textRedactToolButton' },
      { dataElement: 'linkButton' },
    ],
    contextMenuPopup: [
      { dataElement: 'panToolButton' },
      { dataElement: 'stickyToolButton' },
      { dataElement: 'highlightToolButton' },
      { dataElement: 'freeHandToolButton' },
      { dataElement: 'freeTextToolButton' },
    ],
    toolButtonObjects: {
      AnnotationCreateDistanceMeasurement: { dataElement: 'distanceMeasurementToolButton', title: 'annotation.distanceMeasurement', img: 'ic_annotation_distance_black_24px', group: 'measurementTools', showColor: 'active' },
      AnnotationCreatePerimeterMeasurement: { dataElement: 'perimeterMeasurementToolButton', title: 'annotation.perimeterMeasurement', img: 'ic_annotation_perimeter_black_24px', group: 'measurementTools', showColor: 'active' },
      AnnotationCreateAreaMeasurement: { dataElement: 'areaMeasurementToolButton', title: 'annotation.areaMeasurement', img: 'ic_annotation_area_black_24px', group: 'measurementTools', showColor: 'active' },
      AnnotationCreateEllipseMeasurement: { dataElement: 'ellipseMeasurementToolButton', title: 'annotation.areaMeasurement', img: 'ic_annotation_circle_black_24px', group: 'measurementTools', showColor: 'active' },
      AnnotationCreateFreeHand: { dataElement: 'freeHandToolButton', title: 'annotation.freehand', img: 'ic_annotation_freehand_black_24px', group: 'freeHandTools', showColor: 'always' },
      AnnotationCreateFreeHand2: { dataElement: 'freeHandToolButton2', title: 'annotation.freehand2', img: 'ic_annotation_freehand_black_24px', group: 'freeHandTools', showColor: 'always' },
      AnnotationCreateFreeHand3: { dataElement: 'freeHandToolButton3', title: 'annotation.freehand2', img: 'ic_annotation_freehand_black_24px', group: 'freeHandTools', showColor: 'always' },
      AnnotationCreateFreeHand4: { dataElement: 'freeHandToolButton4', title: 'annotation.freehand2', img: 'ic_annotation_freehand_black_24px', group: 'freeHandTools', showColor: 'always' },
      AnnotationCreateTextHighlight: { dataElement: 'highlightToolButton', title: 'annotation.highlight', img: 'ic_annotation_highlight_black_24px', group: 'textTools', showColor: 'always' },
      AnnotationCreateTextHighlight2: { dataElement: 'highlightToolButton2', title: 'annotation.highlight2', img: 'ic_annotation_highlight_black_24px', group: 'textTools', showColor: 'always' },
      AnnotationCreateTextHighlight3: { dataElement: 'highlightToolButton3', title: 'annotation.highlight2', img: 'ic_annotation_highlight_black_24px', group: 'textTools', showColor: 'always' },
      AnnotationCreateTextHighlight4: { dataElement: 'highlightToolButton4', title: 'annotation.highlight2', img: 'ic_annotation_highlight_black_24px', group: 'textTools', showColor: 'always' },
      AnnotationCreateTextUnderline: { dataElement: 'underlineToolButton', title: 'annotation.underline', img: 'ic_annotation_underline_black_24px', group: 'textTools', showColor: 'active' },
      AnnotationCreateTextSquiggly: { dataElement: 'squigglyToolButton', title: 'annotation.squiggly', img: 'ic_annotation_squiggly_black_24px', group: 'textTools', showColor: 'active' },
      AnnotationCreateTextStrikeout: { dataElement: 'strikeoutToolButton', title: 'annotation.strikeout', img: 'ic_annotation_strikeout_black_24px', group: 'textTools', showColor: 'active' },
      AnnotationCreateRectangle: { dataElement: 'rectangleToolButton', title: 'annotation.rectangle', img: 'ic_annotation_square_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateEllipse: { dataElement: 'ellipseToolButton', title: 'annotation.ellipse', img: 'ic_annotation_circle_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateLine: { dataElement: 'lineToolButton', title: 'annotation.line', img: 'ic_annotation_line_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateArrow: { dataElement: 'arrowToolButton', title: 'annotation.arrow', img: 'ic_annotation_arrow_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreatePolyline: { dataElement: 'polylineToolButton', title: 'annotation.polyline', img: 'ic_annotation_polyline_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreatePolygon: { dataElement: 'polygonToolButton', title: 'annotation.polygon', img: 'ic_annotation_polygon_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreatePolygonCloud: { dataElement: 'cloudToolButton', title: 'annotation.polygonCloud', img: 'ic_annotation_cloud_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateRedaction: { dataElement: 'redactionButton', title: 'option.redaction.markForRedaction', img: 'ic_annotation_add_redact_black_24px', showColor: 'never' },
      AnnotationCreateSignature: { dataElement: 'signatureToolButton', title: 'annotation.signature', img: 'ic_annotation_signature_black_24px', showColor: 'active' },
      AnnotationCreateFreeText: { dataElement: 'freeTextToolButton', title: 'annotation.freetext', img: 'ic_annotation_freetext_black_24px', showColor: 'active' },
      AnnotationCreateSticky: { dataElement: 'stickyToolButton', title: 'annotation.stickyNote', img: 'ic_annotation_sticky_note_black_24px', showColor: 'active' },
      AnnotationCreateCallout: { dataElement: 'calloutToolButton', title: 'annotation.callout', img: 'ic_annotation_callout_black_24px', group: 'miscTools', showColor: 'active' },
      AnnotationCreateStamp: { dataElement: 'stampToolButton', title: 'annotation.stamp', img: 'ic_annotation_image_black_24px', group: 'miscTools', showColor: 'active' },
      AnnotationCreateRubberStamp: { dataElement: 'rubberStampToolButton', title: 'annotation.rubberStamp', img: 'ic_annotation_stamp_black_24px', group: 'miscTools', showColor: 'active' },
      AnnotationCreateFileAttachment: { dataElement: 'fileAttachmentToolButton', title: 'annotation.fileattachment', img: 'ic_fileattachment_24px', group: 'miscTools', showColor: 'active' },
      [Tools.ToolNames.RECTANGULAR_AREA_MEASUREMENT]: { dataElement: 'rectangularAreaMeasurementToolButton', title: 'annotation.areaMeasurement', img: 'ic_annotation_rectangular_area_black_24px', group: 'measurementTools', showColor: 'active' },
      Pan: { dataElement: 'panToolButton', title: 'tool.pan', img: 'ic_pan_black_24px', showColor: 'never' },
      AnnotationEdit: { dataElement: 'selectToolButton', title: 'tool.select', img: 'ic_select_black_24px', showColor: 'never' },
      TextSelect: { dataElement: 'textSelectButton', img: 'textselect_cursor', showColor: 'never' },
      MarqueeZoomTool: { dataElement: 'marqueeToolButton', showColor: 'never' },
      AnnotationEraserTool: { dataElement: 'eraserToolButton', title: 'annotation.eraser', img: 'ic_annotation_eraser_black_24px', showColor: 'never' },
      CropPage: { dataElement: 'cropToolButton', title: 'annotation.crop', img: 'ic_crop_black_24px', showColor: 'never', group: 'miscTools' },
    },
    tab: {
      signatureModal: 'inkSignaturePanelButton',
      linkModal: 'URLPanelButton',
    },
    customElementOverrides: {},
    activeHeaderGroup: 'default',
    activeToolName: 'AnnotationEdit',
    activeToolStyles: {},
    activeLeftPanel: getHashParams('hideAnnotationPanel', false) || !getHashParams('a', false) ? 'thumbnailsPanel' : 'notesPanel',
    activeToolGroup: '',
    notePopupId: '',
    isNoteEditing: false,
    fitMode: '',
    zoom: 1,
    rotation: 0,
    displayMode: 'Single',
    currentPage: 1,
    sortStrategy: 'position',
    isFullScreen: false,
    isThumbnailMerging: false,
    isThumbnailReordering: false,
    isThumbnailMultiselect: false,
    allowPageNavigation: true,
    doesAutoLoad: getHashParams('auto_load', true),
    isReadOnly: getHashParams('readonly', false),
    customPanels: [],
    useEmbeddedPrint: false,
    pageLabels: [],
    selectedThumbnailPageIndexes: [],
    noteDateFormat: 'MMM D, h:mma',
    colorMap: copyMapWithDataProperties('currentPalette', 'iconColor'),
    warning: {},
    customNoteFilter: null,
    zoomList: [0.1, 0.25, 0.5, 1, 1.25, 1.5, 2, 4, 8, 16, 64],
    isAccessibleMode: getHashParams('accessibleMode', false),
    measurementUnits: {
      from: ['in', 'mm', 'cm', 'pt'],
      to: ['in', 'mm', 'cm', 'pt', 'ft', 'm', 'yd', 'km', 'mi'],
    },
    maxSignaturesCount: 1,
    maxInitialsCount: 1,
    signatureFonts: ['GreatVibes-Regular'],
    leftPanelWidth: 300,
    isReplyDisabledFunc: null,
    customMeasurementOverlay: [],
    noteTransformFunction: null,
  },
  search: {
    listeners: [],
    value: '',
    isCaseSensitive: false,
    isWholeWord: false,
    isWildcard: false,
    isRegex: false,
    isSearchUp: false,
    isAmbientString: false,
    activeResult: null,
    activeResultIndex: -1,
    results: [],
    isSearching: false,
    noResult: false,
    isProgrammaticSearch: false,
    isProgrammaticSearchFull: false,
  },
  document: {
    totalPages: 0,
    outlines: [],
    bookmarks: {},
    layers: [],
    printQuality: 1,
    passwordAttempts: -1,
    loadingProgress: 0,
  },
  user: {
    name: getHashParams('user', 'Guest'),
    isAdmin: getHashParams('admin', false),
  },
  advanced: {
    customCSS: getHashParams('css', null),
    defaultDisabledElements: getHashParams('disabledElements', ''),
    fullAPI: getHashParams('pdfnet', false),
    preloadWorker: getHashParams('preloadWorker', false),
    serverUrl: getHashParams('server_url', ''),
    serverUrlHeaders: JSON.parse(getHashParams('serverUrlHeaders', '{}')),
    useSharedWorker: getHashParams('useSharedWorker', false),
    disableI18n: getHashParams('disableI18n', false),
    pdfWorkerTransportPromise: null,
    officeWorkerTransportPromise: null
  },
};
