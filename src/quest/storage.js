/**
 * Persistence layer.
 *
 * Everything the app saves goes through this module, and every function is a
 * thin wrapper over one `driver`. Today the driver is localStorage, because
 * Firebase Auth/Firestore are not wired up yet (PRD §6.1) — swapping in
 * Firestore means replacing `localDriver` and nothing else.
 *
 * Three separate namespaces, deliberately:
 *   quests:<id>    the creator's editable draft (plaintext answers)
 *   play:<id>      the compiled payload the recipient downloads (hashed, no reward)
 *   reward:<id>    the Grand Finale payload, released only against a proof (§4.5)
 */

const KEYS = {
  index: 'app.quests.index',
  quest: (id) => `app.quest.${id}`,
  play: (id) => `app.play.${id}`,
  reward: (id) => `app.reward.${id}`,
  progress: (id) => `app.progress.${id}`
}

function safeParse(raw, fallback = null) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * localStorage can throw: Safari private mode, quota, and some in-app browsers
 * (a big share of our recipients — PRD §6.3). Never let a storage failure take
 * the quest down; degrade to in-memory for the session.
 */
function createLocalDriver() {
  const memory = new Map()
  let available
  try {
    const probe = '__storage_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    available = true
  } catch {
    available = false
  }

  return {
    available,
    get(key) {
      if (!available) return memory.get(key) ?? null
      try {
        return window.localStorage.getItem(key)
      } catch {
        return memory.get(key) ?? null
      }
    },
    set(key, value) {
      memory.set(key, value)
      if (!available) return
      try {
        window.localStorage.setItem(key, value)
      } catch {
        /* quota or private mode — the in-memory copy carries this session */
      }
    },
    remove(key) {
      memory.delete(key)
      if (!available) return
      try {
        window.localStorage.removeItem(key)
      } catch {
        /* ignore */
      }
    }
  }
}

let driver = createLocalDriver()

/** Swap the backing store — used by tests and, later, by the Firestore driver. */
export function setDriver(next) {
  driver = next
}

export function resetDriver() {
  driver = createLocalDriver()
}

/* ── Creator-side drafts ────────────────────────────────────────────── */

export function listQuestIds() {
  return safeParse(driver.get(KEYS.index), []) || []
}

function writeIndex(ids) {
  driver.set(KEYS.index, JSON.stringify([...new Set(ids)]))
}

export function saveQuest(quest) {
  driver.set(KEYS.quest(quest.id), JSON.stringify(quest))
  writeIndex([...listQuestIds(), String(quest.id)])
  return quest
}

export function loadQuest(id) {
  return safeParse(driver.get(KEYS.quest(id)))
}

export function loadAllQuests() {
  return listQuestIds()
    .map((id) => loadQuest(id))
    .filter(Boolean)
}

export function deleteQuest(id) {
  driver.remove(KEYS.quest(id))
  driver.remove(KEYS.play(id))
  driver.remove(KEYS.reward(id))
  driver.remove(KEYS.progress(id))
  writeIndex(listQuestIds().filter((known) => String(known) !== String(id)))
}

/* ── Published payloads ─────────────────────────────────────────────── */

/**
 * Store what the recipient downloads and, separately, the reward. The reward is
 * never part of the play payload, so opening devtools on the initial load shows
 * no sign of it (PRD §4.5).
 */
export function publishPayload(playPayload, reward) {
  driver.set(KEYS.play(playPayload.id), JSON.stringify(playPayload))
  driver.set(KEYS.reward(playPayload.id), JSON.stringify({ proof: playPayload.proof, reward }))
}

export function loadPlayPayload(id) {
  const payload = safeParse(driver.get(KEYS.play(id)))
  if (!payload) return null
  // The proof digest is the server's business, not the recipient's.
  const { proof, ...forPlayer } = payload
  void proof
  return forPlayer
}

/**
 * Exchange a completion proof for the reward. This is the client-side stand-in
 * for the Cloud Function in PRD §4.5 and takes the same arguments, so the swap
 * is a one-function change. Returns null when the proof does not match.
 */
export function redeemReward(id, proof) {
  const record = safeParse(driver.get(KEYS.reward(id)))
  if (!record || !proof || record.proof !== proof) return null
  return record.reward
}

/* ── Recipient progress ─────────────────────────────────────────────── */

export function saveProgress(session) {
  if (!session?.questId) return
  driver.set(KEYS.progress(session.questId), JSON.stringify(session))
}

export function loadProgress(id) {
  return safeParse(driver.get(KEYS.progress(id)))
}

export function clearProgress(id) {
  driver.remove(KEYS.progress(id))
}
