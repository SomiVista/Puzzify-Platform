/**
 * Puzzle block catalogue (PRD §4.3) — the UI-facing view of `STEP_KINDS`.
 * Icons match the step glyphs already used on the dashboard quest cards.
 */
import { Lock, HelpCircle, MapPin } from 'lucide-vue-next'

export const BLOCKS = [
  { kind: 'lock', icon: Lock },
  { kind: 'trivia', icon: HelpCircle },
  { kind: 'hotspot', icon: MapPin }
]

const ICONS = Object.fromEntries(BLOCKS.map((block) => [block.kind, block.icon]))

export function blockIcon(kind) {
  return ICONS[kind] || Lock
}
