import React from 'react'

export default (props) => {
  const mX = (props.source.x + props.target.x) / 2
  const mY = (props.source.y + props.target.y) / 2

  return (
    <line
      x1={props.source.x}
      x2={props.target.x}
      y1={props.source.y}
      y2={props.target.y}
      markerEnd="url(#arrow)"
      style={ { transformOrigin: `${mX}px ${mY}px` } }
      />
  )
}
