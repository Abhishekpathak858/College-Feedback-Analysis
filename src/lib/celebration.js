import confetti from "canvas-confetti"

export function triggerPartyPopperConfetti() {
  try {
    if (typeof window === "undefined" || !confetti) return

    const count = 200
    const defaults = {
      origin: { y: 0.7 }
    }

    function fire(particleRatio, opts) {
      try {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        })
      } catch (e) {}
    }

    // Cannon burst 1: Standard festive confetti
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    // Cannon burst 2: Wide sparkle rain
    fire(0.2, {
      spread: 60,
    })

    // Cannon burst 3: High velocity stars
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })

    // Cannon burst 4: Glitter explosion
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })

    // Cannon burst 5: Side party poppers
    try {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })
    } catch (e) {}
  } catch (err) {
    console.warn("Celebration animation safely handled:", err)
  }
}
