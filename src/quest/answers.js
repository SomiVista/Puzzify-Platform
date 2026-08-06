/**
 * Answer handling (PRD §4.5).
 *
 * Correct answers never travel to the recipient as plain text. The creator's
 * draft holds them in the clear (it has to stay editable); `compileQuest` in
 * publish.js swaps them for SHA-256 hashes, and the player hashes what the
 * recipient types and compares digests.
 *
 * Scope note, straight from the PRD: this is deterrence against someone opening
 * devtools, not cryptographic secrecy. Anyone who can solve the quest can, by
 * definition, obtain the reward.
 */

/** Per-quest salt so identical answers across quests don't share a digest. */
export function createSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Fold an answer into its comparable form. Recipients type on phone keyboards:
 * stray spaces and autocapitalisation must not fail an otherwise correct answer.
 */
export function normalizeAnswer(value, { caseSensitive = false } = {}) {
  const text = String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
  return caseSensitive ? text : text.toLocaleLowerCase()
}

async function sha256Hex(input) {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Hash a normalized answer with the quest's salt. */
export function hashAnswer(value, { salt = '', caseSensitive = false } = {}) {
  return sha256Hex(`${salt}:${normalizeAnswer(value, { caseSensitive })}`)
}

/** Constant-ish time digest comparison — both sides are fixed-length hex. */
export function digestsMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Verify a typed answer against a stored digest. */
export async function verifyAnswer(input, digest, options) {
  return digestsMatch(await hashAnswer(input, options), digest)
}

/**
 * Did the tap land inside the hotspot? Coordinates are percentages of the
 * image, so this holds at any render size and under RTL (the image itself is
 * never mirrored — only the layout around it is).
 */
export function isInsideTarget(point, target) {
  if (!point || !target) return false
  const { x, y } = point
  return x >= target.x && x <= target.x + target.w && y >= target.y && y <= target.y + target.h
}

/**
 * Verify a recipient's response for any block kind.
 *
 * - `lock`   — hashed string comparison.
 * - `trivia` — the chosen index is hashed with the salt. Four options means a
 *              determined inspector can brute-force it; hashing still keeps the
 *              answer out of the payload, which is the stated goal.
 * - `hotspot`— geometric, so the target box has to ship. The image alone gives
 *              nothing away without knowing what to look for.
 */
export async function verifyResponse(step, response) {
  const solution = step.solution || {}
  switch (step.kind) {
    case 'lock':
      return verifyAnswer(response, solution.digest, {
        salt: solution.salt,
        caseSensitive: Boolean(solution.caseSensitive)
      })
    case 'trivia': {
      if (!Number.isInteger(response)) return false
      const digest = await hashAnswer(String(response), { salt: solution.salt, caseSensitive: true })
      return digestsMatch(digest, solution.digest)
    }
    case 'hotspot':
      return isInsideTarget(response, solution.target)
    default:
      return false
  }
}
