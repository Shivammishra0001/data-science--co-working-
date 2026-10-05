// Draw an image into a canvas with object-fit: contain semantics,
// sized for the device pixel ratio. Frames are black-matted so the
// letterbox area is cleared (transparent) rather than painted.
export function drawContain(canvas, img, { alpha = 1, clear = true } = {}) {
  if (!canvas || !img || !img.naturalWidth) return
  const ctx = canvas.getContext('2d')
  const { width: cw, height: ch } = canvas
  const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  if (clear) ctx.clearRect(0, 0, cw, ch)
  ctx.globalAlpha = alpha
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
  ctx.globalAlpha = 1
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
