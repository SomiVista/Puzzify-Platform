import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAppStore } from './useAppStore'
import { getOccasionPreset } from '../quest/occasions'
import { publishQuest, playerUrl } from '../quest/publish'
import {
  createQuestDraft,
  createStep,
  insertStep,
  removeStep,
  moveStep,
  moveStepToSlot,
  isStepValid,
  validateQuest,
  normalizeMaxAttempts,
  flowFromQuest
} from '../quest/model'

/**
 * Quest Builder session state (PRD §4.2.2–§4.2.4).
 *
 * Holds ONE draft at a time. All flow mutations go through the pure helpers in
 * `quest/model.js`, so ordering rules are defined in exactly one place and the
 * store stays a thin, testable shell around them.
 */
export const useBuilderStore = defineStore('builder', () => {
  const draft = ref(createQuestDraft())
  const selectedStepId = ref(null)
  const dirty = ref(false)
  const isNew = ref(true)

  // Drag state. A drag is either "a new block from the palette" (dragKind) or
  // "an existing card being reordered" (dragIndex) — never both.
  const dragKind = ref(null)
  const dragIndex = ref(null)
  const dropSlot = ref(null)

  /* ── Getters ────────────────────────────────────────────────────── */

  const flow = computed(() => draft.value.flow)
  const stepCount = computed(() => flow.value.length)
  const selectedIndex = computed(() =>
    flow.value.findIndex((step) => step.id === selectedStepId.value)
  )
  const selectedStep = computed(() => flow.value[selectedIndex.value] || null)

  /** id → boolean, for the validity dot on each canvas card. */
  const stepValidity = computed(() =>
    Object.fromEntries(flow.value.map((step) => [step.id, isStepValid(step)]))
  )
  const questIssues = computed(() => validateQuest(draft.value))
  const isDragging = computed(() => dragKind.value !== null || dragIndex.value !== null)

  const themePreset = computed(() => draft.value.theme.preset)

  /* ── Loading ────────────────────────────────────────────────────── */

  /** Start a blank quest, seeded by an occasion preset (PRD §4.2.1). */
  function startNew(occasionId) {
    const app = useAppStore()
    const preset = getOccasionPreset(occasionId)
    draft.value = createQuestDraft({
      id: app.nextQuestId(),
      occasion: preset ? preset.id : '',
      theme: {
        preset: preset ? preset.themePreset : 'birthday',
        ambientAudio: true,
        particles: true
      },
      reward: { type: preset ? preset.rewardType : 'letter' }
    })
    selectedStepId.value = null
    dirty.value = false
    isNew.value = true
  }

  /** Load a quest from the dashboard. Returns false when the id is unknown. */
  function loadExisting(id) {
    const app = useAppStore()
    const quest = app.getQuestById(id)
    if (!quest) return false
    const base = createQuestDraft()
    draft.value = {
      ...base,
      ...quest,
      flow: flowFromQuest(quest),
      theme: { ...base.theme, ...(quest.theme || {}) },
      reward: { ...base.reward, ...(quest.reward || {}) }
    }
    selectedStepId.value = draft.value.flow[0]?.id ?? null
    dirty.value = false
    isNew.value = false
    return true
  }

  /* ── Flow editing ───────────────────────────────────────────────── */

  function addStep(kind, slot = stepCount.value) {
    const step = createStep(kind)
    draft.value.flow = insertStep(flow.value, step, slot)
    selectedStepId.value = step.id
    dirty.value = true
    return step
  }

  /** Reorder by drop gap — see `moveStepToSlot` for why slots ≠ indexes. */
  function reorderStep(from, slot) {
    draft.value.flow = moveStepToSlot(flow.value, from, slot)
    dirty.value = true
  }

  /** Keyboard/button reorder: move a card one place up or down. */
  function nudgeStep(index, delta) {
    const target = index + delta
    if (index < 0 || index >= stepCount.value) return
    if (target < 0 || target >= stepCount.value) return
    draft.value.flow = moveStep(flow.value, index, target)
    dirty.value = true
  }

  function deleteStep(index) {
    if (index < 0 || index >= stepCount.value) return
    draft.value.flow = removeStep(flow.value, index)
    // Keep the wizard on a sensible neighbour rather than dropping selection.
    const next = flow.value[index] || flow.value[index - 1] || null
    selectedStepId.value = next ? next.id : null
    dirty.value = true
  }

  /* ── Wizard navigation (strictly linear order) ──────────────────── */

  function selectStep(id) {
    selectedStepId.value = id
  }

  function selectByIndex(index) {
    const step = flow.value[index]
    if (step) selectedStepId.value = step.id
  }

  function selectNext() {
    selectByIndex(selectedIndex.value + 1)
  }

  function selectPrev() {
    if (selectedIndex.value > 0) selectByIndex(selectedIndex.value - 1)
  }

  /* ── Step configuration ─────────────────────────────────────────── */

  function updateStep(patch) {
    const step = selectedStep.value
    if (!step) return
    const next = { ...patch }
    // Max Attempts is stored normalized so the model invariant holds no matter
    // what the number input hands us (PRD §4.2.4).
    if ('maxAttempts' in next) next.maxAttempts = normalizeMaxAttempts(next.maxAttempts)
    Object.assign(step, next)
    dirty.value = true
  }

  function updateConfig(patch) {
    const step = selectedStep.value
    if (!step) return
    step.config = { ...step.config, ...patch }
    dirty.value = true
  }

  function setName(name) {
    draft.value.name = name
    dirty.value = true
  }

  /* ── Theme configurator (PRD §4.2.3) ────────────────────────────── */

  function setThemePreset(preset) {
    draft.value.theme.preset = preset
    dirty.value = true
  }

  function setAmbientAudio(on) {
    draft.value.theme.ambientAudio = Boolean(on)
    dirty.value = true
  }

  function setParticles(on) {
    draft.value.theme.particles = Boolean(on)
    dirty.value = true
  }

  function setRewardType(type) {
    draft.value.reward.type = type
    dirty.value = true
  }

  /** Edit the Grand Finale payload (body / code / url), never its type. */
  function updateReward(patch) {
    draft.value.reward = { ...draft.value.reward, ...patch }
    dirty.value = true
  }

  /* ── Drag & drop ────────────────────────────────────────────────── */

  function beginPaletteDrag(kind) {
    dragKind.value = kind
    dragIndex.value = null
  }

  function beginCardDrag(index) {
    dragIndex.value = index
    dragKind.value = null
  }

  function setDropSlot(slot) {
    dropSlot.value = slot
  }

  function endDrag() {
    dragKind.value = null
    dragIndex.value = null
    dropSlot.value = null
  }

  /** Resolve the active drag into an insert or a reorder. */
  function dropAt(slot = dropSlot.value) {
    const target = slot ?? stepCount.value
    if (dragKind.value) {
      addStep(dragKind.value, target)
    } else if (dragIndex.value !== null) {
      reorderStep(dragIndex.value, target)
    }
    endDrag()
  }

  /* ── Persistence ────────────────────────────────────────────────── */

  /** Write the draft back to the dashboard's quest list. */
  function save() {
    const app = useAppStore()
    const record = app.upsertQuest({ ...draft.value, flow: [...flow.value] })
    dirty.value = false
    isNew.value = false
    return record
  }

  /**
   * Publish (PRD §4.2.5): compile the draft into a payload with hashed answers,
   * split off the reward, and hand back the unguessable /q/{id} link. Keeps the
   * same player id across re-publishes so a link already sent keeps working.
   */
  async function publish() {
    const app = useAppStore()
    draft.value.lang = app.lang
    draft.value.status = 'Published'

    const { playerId, url } = await publishQuest(
      { ...draft.value, flow: [...flow.value] },
      { questId: draft.value.playerId }
    )
    draft.value.playerId = playerId
    draft.value.shareUrl = url
    save()
    return { playerId, url }
  }

  /** The share link for an already-published quest, if it has one. */
  const shareUrl = computed(() =>
    draft.value.playerId ? playerUrl(draft.value.playerId) : ''
  )
  const isPublished = computed(() => draft.value.status === 'Published' && Boolean(draft.value.playerId))

  return {
    draft, selectedStepId, dirty, isNew, dragKind, dragIndex, dropSlot,
    flow, stepCount, selectedIndex, selectedStep, stepValidity, questIssues,
    isDragging, themePreset, shareUrl, isPublished,
    startNew, loadExisting,
    addStep, reorderStep, nudgeStep, deleteStep,
    selectStep, selectByIndex, selectNext, selectPrev,
    updateStep, updateConfig, setName,
    setThemePreset, setAmbientAudio, setParticles, setRewardType, updateReward,
    beginPaletteDrag, beginCardDrag, setDropSlot, endDrag, dropAt,
    save, publish
  }
})
