export async function randomSleep(ms: number) {
  return new Promise((r) => {
    setTimeout(r, ms + (Math.random() * ms))
  })
}

export async function fixSleep(ms: number) {
  return new Promise((r) => {
    setTimeout(r, ms)
  })
}
