import { test, expect } from '@playwright/test'

/**
 * Mobile layout guards (PRD §6.3). These pin down two regressions that unit and
 * flow tests cannot see, because Playwright happily clicks elements that are
 * visually squeezed or pushed off-screen:
 *   1. the landing header pushed the language switcher out of the viewport;
 *   2. the dashboard's 250px sidebar never collapsed, leaving 125px of content.
 */

const PHONE = { width: 375, height: 812 }

test.use({ viewport: PHONE })

/** True when no element escapes the viewport horizontally. */
async function horizontalOverflow(page) {
  return page.evaluate(() => {
    const de = document.documentElement
    return de.scrollWidth > de.clientWidth
  })
}

test.describe('Landing page on a phone', () => {
  test.beforeEach(async ({ page }) => page.goto('/'))

  test('keeps the language switcher inside the viewport', async ({ page }) => {
    const langButton = page.getByRole('button', { name: 'Language options' })
    await expect(langButton).toBeVisible()

    const box = await langButton.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(PHONE.width)
    // Design-system hit-target floor (design.md §2.2).
    expect(box.height).toBeGreaterThanOrEqual(44)
  })

  test('can actually switch language from a phone', async ({ page }) => {
    await page.getByRole('button', { name: 'Language options' }).click()
    // Scope to the header — the footer has its own language switcher.
    await page.locator('header').getByRole('button', { name: /فارسی/ }).click()

    await expect(page.locator('.app-stage')).toHaveAttribute('dir', 'rtl')
  })

  test('does not scroll horizontally', async ({ page }) => {
    expect(await horizontalOverflow(page)).toBe(false)
  })

  test('keeps every theme preset reachable', async ({ page }) => {
    for (const name of ['Celebration', 'Mystery', 'Spooky', 'Corporate']) {
      const pill = page.getByRole('button', { name, exact: true })
      const box = await pill.boundingBox()
      expect(box.x + box.width, `${name} pill is cut off`).toBeLessThanOrEqual(PHONE.width)
      expect(box.height, `${name} pill is under 44px`).toBeGreaterThanOrEqual(44)
    }
  })
})

test.describe('Dashboard on a phone', () => {
  test.beforeEach(async ({ page }) => page.goto('/dashboard/quests'))

  test('collapses the sidebar so content gets the full width', async ({ page }) => {
    const content = await page.locator('.main-content').boundingBox()

    // The rail must be stacked above, not beside, the content.
    expect(content.x).toBeLessThan(20)
    expect(content.width).toBeGreaterThan(PHONE.width * 0.9)
  })

  test('keeps the workspace nav usable', async ({ page }) => {
    // The nav scrolls horizontally rather than clipping items away for good.
    const nav = page.locator('.nav-menu')
    await expect(nav).toBeVisible()
    await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible()
  })

  test('does not scroll horizontally', async ({ page }) => {
    expect(await horizontalOverflow(page)).toBe(false)
  })

  test('meets the 44px hit-target floor on the quest actions', async ({ page }) => {
    const edit = page.getByTestId('edit-quest-3')
    const box = await edit.boundingBox()
    expect(box.height).toBeGreaterThanOrEqual(44)
    expect(box.width).toBeGreaterThanOrEqual(44)
  })

  test('reaches the Quest Builder and stacks its three panes', async ({ page }) => {
    await page.getByTestId('occasion-birthday').click()

    const canvas = await page.getByTestId('flow-canvas').boundingBox()
    expect(canvas.width).toBeGreaterThan(PHONE.width * 0.9)
    expect(await horizontalOverflow(page)).toBe(false)
  })
})
