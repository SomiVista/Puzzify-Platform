<script setup>
/**
 * @file FinalCta.vue
 * @description Final call to action section.
 */

</script>

<template>
  <section style="position:relative; overflow:hidden; background:radial-gradient(120% 120% at 50% -20%, var(--color-surface-2), var(--color-bg) 65%); border-top:1px solid var(--color-hairline);">
    <div style="position:relative; max-width:760px; margin:0 auto; padding:clamp(56px,8vw,104px) clamp(16px,4vw,26px); text-align:center;">
      <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--color-secondary);">{{ $t('finalKicker') }}</span>
      <h2 style="margin:14px 0 14px; font-family:var(--font-display); font-weight:800; font-size:clamp(30px,4.6vw,52px); line-height:1.04; letter-spacing:-.025em; color:var(--color-text); text-wrap:balance;">{{ $t('finalLine') }}</h2>
      <p style="margin:0 auto 30px; max-width:46ch; font-size:clamp(15px,1.6vw,18px); line-height:1.55; color:var(--color-muted);">{{ $t('finalSub') }}</p>
      <a href="#top" style="display:inline-flex; align-items:center; justify-content:center; padding:16px 30px; min-height:44px; background:var(--color-primary); color:var(--color-on-primary); border-radius:var(--radius-md); font-family:var(--font-ui); font-weight:700; font-size:16px; text-decoration:none; box-shadow:var(--shadow-2);">{{ $t('finalCta') }}</a>
    </div>
  </section>
</template>
