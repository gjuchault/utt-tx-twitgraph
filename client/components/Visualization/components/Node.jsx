import React from 'react'

function show(circle) {
  const x = parseInt(circle.getAttribute('cx'), 10)
  const y = parseInt(circle.getAttribute('cy'), 10)
  const label = circle.dataset.label

  const tooltip = document.querySelector(`.node-tooltip[data-label="${label}"]`)

  tooltip.style.top = `${y + 58 + 30}px`
  tooltip.style.left = `${x + 20}px`
  tooltip.style.display = 'inline-flex'
}

function hide(circle) {
  const label = circle.dataset.label
  const tooltip = document.querySelector(`.node-tooltip[data-label="${label}"]`)
  tooltip.style.display = 'none'
}

export default (props) => {
  return (<circle
    r={props.radius}
    cx={props.x}
    cy={props.y}
    className={props.initial ? 'initial' : ''}
    data-label={props.label}
    onMouseEnter={(e) => show(e.target)}
    onMouseLeave={(e) => hide(e.target)}
    />)
}
