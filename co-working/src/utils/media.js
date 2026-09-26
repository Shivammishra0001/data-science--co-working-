// Draw an image into a canvas with object-fit: contain semantics,
// sized for the device pixel ratio. Frames are black-matted so the
// letterbox area is cleared (transparent) rather than painted.
export function drawContain(canvas, img) {
  if (!canvas || !img || !img.naturalWidth) return
  const ctx = canvas.getContext('2d')
  const { width: cw, height: ch } = canvas
  const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
}

// Keep a canvas' backing store matched to its CSS box. Returns true when resized.
export function syncCanvasSize(canvas) {
  if (!canvas) return false
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const { clientWidth, clientHeight } = canvas
  const w = Math.round(clientWidth * dpr)
  const h = Math.round(clientHeight * dpr)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
    return true
  }
  return false
}
