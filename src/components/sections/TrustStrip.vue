<script setup>
/**
 * @file TrustStrip.vue
 * @description Trust markers and statistics.
 */
</script>

<template>
  <section style="border-top:1px solid var(--color-hairline); border-bottom:1px solid var(--color-hairline); background:var(--color-surface);">
    <div style="max-width:1180px; margin:0 auto; padding:22px clamp(16px,4vw,26px); display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;">
      <p style="margin:0; font-family:var(--font-display); font-weight:700; font-size:clamp(16px,2vw,20px); color:var(--color-text); max-width:24ch;">{{ $t('trustLine') }}</p>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <span v-for="(s, index) in $tm('trustStats')" :key="index" style="display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--color-muted); background:var(--color-surface-2); border:1px solid var(--color-border); padding:9px 14px; border-radius:var(--radius-full);">
          <span style="width:6px; height:6px; border-radius:50%; background:var(--color-success);"></span>{{ s }}
        </span>
      </div>
    </div>
  </section>
</template>
