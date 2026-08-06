/**
 * Publishing (PRD §4.2.5) — turn an editable draft into the payload a recipient
 * downloads at /q/{questId}.
 *
 * Two things happen here and nowhere else:
 *   1. plaintext answers become salted SHA-256 digests;
 *   2. the reward is split off, so it is absent from the initial payload and
 *      only obtainable by exchanging a completion proof (§4.5).
 */
import { createSalt, hashAnswer } from './answers'
import { publishPayload } from './storage'

/**
 * Unguessable id — 128 bits of CSPRNG in base36. Sequential dashboard ids are
 * fine for the creator's own list, but the player URL must not be walkable.
 */
export function generateQuestId() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(36).padStart(2, '0')).join('')
}

/** The canonical player path (PRD §8). */
export function playerPath(questId) {
  return `/q/${questId}`
}

export function playerUrl(questId, origin = window.location.origin) {
  return `${origin}${playerPath(questId)}`
}

/** Strip a step down to what the player needs, hashing the solution. */
async function compileStep(step, salt) {
  const shared = {
    id: step.id,
    kind: step.kind,
    title: step.title || '',
    prompt: step.prompt || '',
    hintText: step.hintText || '',
    successMessage: step.successMessage || '',
    maxAttempts: step.maxAttempts ?? null
  }

  switch (step.kind) {
    case 'lock':
      return {
        ...shared,
        solution: {
          salt,
          caseSensitive: Boolean(step.config.caseSensitive),
          digest: await hashAnswer(step.config.answer, {
            salt,
            caseSensitive: Boolean(step.config.caseSensitive)
          })
        }
      }
    case 'trivia':
      return {
        ...shared,
        // Options must ship — they are the question. Only the index is hidden.
        options: [...step.config.options],
        solution: {
          salt,
          digest: await hashAnswer(String(step.config.correctIndex), {
            salt,
            caseSensitive: true
          })
        }
      }
    case 'hotspot':
      return {
        ...shared,
        imageUrl: step.config.imageUrl,
        // Geometric by nature, so the box ships; the image gives nothing away
        // without knowing what you are looking for.
        solution: { target: { ...step.config.target } }
      }
    default:
      return shared
  }
}

/**
 * Compile a draft into `{ payload, reward, proof }`.
 * `payload` is safe to serve; `reward` must stay behind the proof.
 */
export async function compileQuest(draft, { questId } = {}) {
  const id = questId || draft.playerId || generateQuestId()
  const salt = createSalt()
  const proofSalt = createSalt()

  const steps = await Promise.all(draft.flow.map((step) => compileStep(step, salt)))

  const payload = {
    id,
    name: draft.name,
    // The gift is written in the sender's language; the player renders in it.
    lang: draft.lang || 'en',
    theme: { ...draft.theme },
    rewardType: draft.reward?.type || 'letter',
    watermark: draft.watermark !== false,
    proofSalt,
    steps
  }

  // Same derivation the engine uses in completionProof — keep them in step.
  const proof = await hashAnswer(
    steps.map((step) => step.solution?.digest ?? step.id).join('|'),
    { salt: proofSalt, caseSensitive: true }
  )

  return { payload: { ...payload, proof }, reward: draft.reward || { type: 'letter' }, proof }
}

/**
 * Compile and store. Returns the player id and shareable URL for the creator
 * to copy.
 */
export async function publishQuest(draft, options = {}) {
  const { payload, reward } = await compileQuest(draft, options)
  publishPayload(payload, reward)
  return { playerId: payload.id, url: playerUrl(payload.id, options.origin) }
}
