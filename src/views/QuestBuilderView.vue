<template>
  <div class="studio">
    <BuilderTopBar @save="onSave" @publish="onPublish" />

    <div class="panes">
      <aside class="rail rail-start">
        <BlockPalette />
      </aside>

      <main class="canvas-pane">
        <FlowCanvas />
      </main>

      <aside class="rail rail-end">
        <StepInspector />
        <ThemeConfigurator />
        <RewardEditor />
        <LivePreview />
      </aside>
    </div>
  </div>
</template>

<script setup>
/**
 * Quest Builder — the Creator Studio window (PRD §4.2.2–§4.2.4).
 * Left rail: puzzle blocks · centre: linear flow canvas · right rail: step
 * wizard, theme configurator and live preview (design.md §3).
 */
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBuilderStore } from '../stores/useBuilderStore'
import BuilderTopBar from '../components/builder/BuilderTopBar.vue'
import BlockPalette from '../components/builder/BlockPalette.vue'
import FlowCanvas from '../components/builder/FlowCanvas.vue'
import StepInspector from '../components/builder/StepInspector.vue'
import ThemeConfigurator from '../components/builder/ThemeConfigurator.vue'
import RewardEditor from '../components/builder/RewardEditor.vue'
import LivePreview from '../components/builder/LivePreview.vue'

const route = useRoute()
const router = useRouter()
const builder = useBuilderStore()

function loadFromRoute() {
  const id = route.params.id
  if (!id) {
    builder.startNew(route.query.occasion)
    return
  }
  // Saving a new quest rewrites the URL to its edit path; don't reload over the
  // draft the creator is still working on.
  if (String(builder.draft.id) === String(id) && !builder.isNew) return
  if (!builder.loadExisting(id)) {
    router.replace({ name: 'dashboard-quests' })
  }
}

watch(() => [route.params.id, route.query.occasion], loadFromRoute, { immediate: true })

function onSave() {
  const record = builder.save()
  claimEditUrl(record)
}

/** Publish compiles the quest and hands back its /q/{id} link. */
async function onPublish() {
  await builder.publish()
  claimEditUrl(builder.draft)
}

function claimEditUrl(record) {
  if (!route.params.id) {
    router.replace({ name: 'quest-builder', params: { id: record.id } })
  }
}
</script>

<style scoped>
.studio {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg);
  overflow: hidden;
}

.panes {
  flex: 1;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr) 340px;
  min-height: 0;
}

.rail {
  overflow-y: auto;
  background: var(--color-surface);
}
.rail-start {
  border-inline-end: 1px solid var(--color-hairline);
}
.rail-end {
  border-inline-start: 1px solid var(--color-hairline);
}
/* The first section in the end rail has no divider above it. */
.rail-end > :first-child {
  border-top: none;
}

.canvas-pane {
  overflow-y: auto;
  min-width: 0;
}

@media (max-width: 1180px) {
  .panes {
    grid-template-columns: 230px minmax(0, 1fr) 300px;
  }
}
@media (max-width: 1000px) {
  .studio {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
  .panes {
    grid-template-columns: 1fr;
  }
  .rail {
    overflow: visible;
  }
  .rail-start,
  .rail-end {
    border-inline: none;
    border-block-end: 1px solid var(--color-hairline);
  }
}
</style>
