import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

import getBrightness from 'helpers/getBrightness';
import selectors from 'selectors';

import './ColorPalette.scss';

const dataElement = 'colorPalette';

const loadImg = async url => new Promise(res => {
  const img = new window.Image();

  img.addEventListener('load', () => res(img));
  img.src = url;
});

export const drawImageOnCanvas = async url => {
  const image = await loadImg(url);
  const canvas = document.createElement('canvas');

  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');

  context.drawImage(image, 0, 0);

  return { canvas, context, image };
};

class ColorPalette extends React.PureComponent {
  static propTypes = {
    property: PropTypes.string.isRequired,
    color: PropTypes.object,
    onStyleChange: PropTypes.func.isRequired,
    colorMapKey: PropTypes.string.isRequired,
    overridePalette: PropTypes.object,
    annotation: PropTypes.object,
  };

  defaultPalette = [
    '#F1A099',
    '#FFC67B',
    '#FFE6A2',
    '#80E5B1',
    '#92E8E8',
    '#A6A1E6',
    '#E2A1E6',
    '#E44234',
    '#FF8D00',
    '#FFCD45',
    '#00CC63',
    '#25D2D1',
    '#4E7DE9',
    '#C544CE',
    '#88271F',
    '#B54800',
    '#F69A00',
    '#007A3B',
    '#167E7D',
    '#2E4B8B',
    '#76287B',
    'transparency',
    '#FFFFFF',
    '#CDCDCD',
    '#9C9C9C',
    '#696969',
    '#373737',
    '#000000',
  ];

  setColor = e => {
    const { property, onStyleChange } = this.props;
    const bg = e.target.style.backgroundColor; // rgb(r, g, b);
    const rgba = bg ? bg.slice(bg.indexOf('(') + 1, -1).split(',') : [0, 0, 0, 0];
    if (this.props.annotation instanceof window.Annotations.StampAnnotation) {
      drawImageOnCanvas(this.props.annotation.ImageData).then(({ canvas, context }) => {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;
        // Loop over each pixel, where i is the position of the red, i + 1 is green, i + 2 is blue, and i + 3 is alpha (transparency), and all are 0-255
        for (let i = 0; i < data.length; i += 4) {
          // Skip transparent pixels
          if (data[i + 3] === 0) {
            continue;
          }

          data[i] = rgba[0];
          data[i + 1] = rgba[1];
          data[i + 2] = rgba[2];
        }
        context.putImageData(imageData, 0, 0);
        this.props.annotation.ImageData = canvas.toDataURL('image/png');
        const annotManager = window.docViewer.getAnnotationManager();
        annotManager.updateAnnotation(this.props.annotation);
        annotManager.redrawAnnotation(this.props.annotation);
        annotManager.trigger('annotationChanged', [[this.props.annotation], 'modify', { imported: false, isUndoRedo: false }]);
      });
    } else {
      const color = new window.Annotations.Color(rgba[0], rgba[1], rgba[2], rgba[3]);
      onStyleChange(property, color);
    }
  };

  renderTransparencyCell = bg => {
    const { property } = this.props;
    const shouldRenderDummyCell = property === 'TextColor' || property === 'StrokeColor';

    if (shouldRenderDummyCell) {
      return <div className="dummy-cell" />;
    }

    const diagonalLine = (
      <svg width="100%" height="100%" style={{ position: 'absolute', top: '0px', left: '0px' }}>
        <line
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          strokeWidth="1"
          stroke="#e44234"
          strokeLinecap="square"
        />
      </svg>
    );

    return (
      <div
        className="cell"
        onClick={this.setColor}
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0' }}
      >
        {this.renderCheckMark(bg)}
        {diagonalLine}
      </div>
    );
  };

  renderColorCell = bg => {
    let style = { backgroundColor: bg };

    if (bg === '#FFFFFF') {
      style = Object.assign(style, {
        border: '1px solid #e0e0e0',
      });
    }

    return (
      <div className="cell" style={style} onClick={this.setColor}>
        {this.renderCheckMark(bg)}
      </div>
    );
  };

  renderCheckMark = bg => {
    const { color } = this.props;
    const hexColor = color?.toHexString();

    let isColorPicked;
    if (hexColor === null) {
      isColorPicked = bg === 'transparency';
    } else {
      isColorPicked = hexColor?.toLowerCase() === bg.toLowerCase();
    }

    return isColorPicked ? (
      <Icon className={`check-mark ${getBrightness(color)}`} glyph="ic_check_black_24px" />
    ) : null;
  };

  render() {
    const { overridePalette, colorMapKey } = this.props;
    const palette = this.props.annotation instanceof window.Annotations.StampAnnotation
      ? ['#4B92DB', '#000000']
      : overridePalette?.[colorMapKey] || overridePalette?.global || this.defaultPalette;

    return (
      <div className="ColorPalette" data-element={dataElement}>
        {palette.map(bg => (
          <React.Fragment key={bg}>
            {bg === 'transparency' ? this.renderTransparencyCell(bg) : this.renderColorCell(bg)}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  overridePalette: selectors.getCustomElementOverrides(state, dataElement),
});

export default connect(mapStateToProps)(ColorPalette);
