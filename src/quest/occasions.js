/**
 * Occasion presets (PRD §4.2.1) — dashboard shortcuts that pre-seed a new
 * quest's theme, ambient audio and reward box.
 *
 * These are DATA, not logic: nothing in the app branches on an occasion id.
 * A preset only chooses which theme preset (src/themes.js) a new quest starts
 * on, which keeps the platform occasion-agnostic (PRD §2.1).
 */
import { Cake, Heart, Snowflake, Search, Briefcase, Plus } from 'lucide-vue-next'

export const OCCASION_PRESETS = [
  { id: 'birthday', labelKey: 'builder.occasions.birthday', themePreset: 'birthday', rewardType: 'letter', icon: Cake },
  { id: 'anniversary', labelKey: 'builder.occasions.anniversary', themePreset: 'birthday', rewardType: 'letter', icon: Heart },
  { id: 'holiday', labelKey: 'builder.occasions.holiday', themePreset: 'birthday', rewardType: 'voucher', icon: Snowflake },
  { id: 'mysteryNight', labelKey: 'builder.occasions.mysteryNight', themePreset: 'mystery', rewardType: 'video', icon: Search },
  { id: 'corporate', labelKey: 'builder.occasions.corporate', themePreset: 'corporate', rewardType: 'voucher', icon: Briefcase },
  { id: 'blank', labelKey: 'builder.occasions.blank', themePreset: 'birthday', rewardType: 'letter', icon: Plus }
]

export function getOccasionPreset(id) {
  return OCCASION_PRESETS.find((preset) => preset.id === id) || null
}
