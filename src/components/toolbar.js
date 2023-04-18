const toolbar = [
  // { separator: true },
  // // { icon: 'save', tooltip: 'Save', action: 'saveCanvas' },
  // { icon: 'zoom_in', tooltip: 'Zoom in', action: 'zoom', arg: 4 / 3 },
  // { icon: 'zoom_out', tooltip: 'Zoom out', action: 'zoom', arg: 3 / 4 },
  // { separator: true },
  // { icon: 'mdi-vector-polygon', tooltip: 'Polygon', action: 'drawPolygon' },
  // { separator: true },
  // { icon: 'text_format', tooltip: 'Text', action: 'addText' },
  // { icon: 'category', tooltip: 'Add object', action: 'addObject' },
  // { icon: 'insert_photo', tooltip: 'Add images', action: 'addImage' },
  // { icon: 'crop', tooltip: 'Clip object', action: 'clipObject' },
  // { icon: 'crop_free', tooltip: 'Resize canvas', action: 'defineCanvasSize' },
  // {
  //   icon: 'brush',
  //   tooltip: 'Toggle uniform stroke',
  //   action: 'toggleUniformStroke'
  // },
  // { separator: true },
  // {
  //   icon: 'mdi-flip-horizontal',
  //   tooltip: 'Flip horizontal',
  //   action: 'flip',
  //   arg: 'X'
  // },
  // {
  //   icon: 'mdi-flip-vertical',
  //   tooltip: 'Flip vertical',
  //   action: 'flip',
  //   arg: 'Y'
  // },
  {
    icon: 'mdi-group',
    tooltip: 'Group',
    action: 'groupItems'
  },
  {
    icon: 'mdi-ungroup',
    tooltip: 'Ungroup',
    action: 'ungroupItems'
  },
  {
    icon: 'mdi-arrange-bring-forward',
    tooltip: 'Bring forward',
    action: 'bringForward'
  },
  {
    icon: 'mdi-arrange-send-backward',
    tooltip: 'Send backward',
    action: 'sendBackward'
  },
  {
    icon: 'mdi-arrange-bring-to-front',
    tooltip: 'Bring to front',
    action: 'bringToFront'
  },
  {
    icon: 'mdi-arrange-send-to-back',
    tooltip: 'Send to back',
    action: 'sendToBack'
  }
  // { separator: true },
  // { icon: 'delete_outline', tooltip: 'Delete', action: 'deleteItem' },
  // { icon: 'delete_forever', tooltip: 'Clear all', action: 'clearCanvas' }
  // {
  //   icon: 'undo',
  //   tooltip: 'Undo',
  //   action: 'undoRedo',
  //   arg: -1,
  //   undoRedo: true
  // },
  // { icon: 'redo', tooltip: 'Redo', action: 'undoRedo', arg: 1, undoRedo: true }
]

export default toolbar
