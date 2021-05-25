
export function range (val, inMin, inMax, outMin, outMax) { return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin }
export function lerp (start, end, amt) { return (1 - amt) * start + amt * end }

export function randomGenerator (a) {
  return a ? function () {
    var t = a += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    var r = ((t ^ t >>> 14) >>> 0) / 4294967296
    return r
  } : Math.random
}
