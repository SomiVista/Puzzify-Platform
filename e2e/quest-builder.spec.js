import { test, expect } from '@playwright/test'

/**
 * Creator Studio — canvas, Flow Manager, per-step settings, theme configurator
 * (PRD §4.2.2–§4.2.4). Runs on both the desktop and Pixel 7 projects.
 */

const card = (page, i) => page.getByTestId(`step-card-${i}`)

test.describe('Quest Builder', () => {
  test('opens from a dashboard occasion preset with that theme seeded', async ({ page }) => {
    await page.goto('/dashboard/quests')

    await page.getByTestId('occasion-mysteryNight').click()

    await expect(page).toHaveURL(/\/dashboard\/quests\/new\?occasion=mysteryNight/)
    await expect(page.getByTestId('flow-canvas')).toBeVisible()
    // Mystery night seeds the mystery theme preset (occasions.js).
    await expect(page.getByTestId('theme-mystery')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('canvas-empty')).toBeVisible()
  })

  test('opens blank from the New quest button', async ({ page }) => {
    await page.goto('/dashboard/quests')
    await page.getByTestId('new-quest').click()

    await expect(page).toHaveURL(/\/dashboard\/quests\/new/)
    await expect(page.getByTestId('theme-birthday')).toHaveAttribute('aria-pressed', 'true')
  })

  test('drags a puzzle block from the palette onto the canvas', async ({ page }) => {
    await page.goto('/dashboard/quests/new')

    await page.getByTestId('palette-lock').dragTo(page.getByTestId('drop-slot-0'))

    await expect(card(page, 0)).toBeVisible()
    await expect(page.getByTestId('step-count')).toContainText('1')
    await expect(card(page, 0)).toContainText('Text / Password Lock')
  })

  test('drops a block into the gap it was dragged to', async ({ page }) => {
    await page.goto('/dashboard/quests/new')
    await page.getByTestId('palette-lock').click()
    await page.getByTestId('palette-hotspot').click()

    // Gap 1 sits between the two existing cards.
    await page.getByTestId('palette-trivia').dragTo(page.getByTestId('drop-slot-1'))

    await expect(card(page, 1)).toContainText('Trivia')
    await expect(card(page, 2)).toContainText('Image Hotspot')
  })

  test('configures a step and its advanced settings', async ({ page }) => {
    await page.goto('/dashboard/quests/new')
    await page.getByTestId('palette-lock').click()

    await expect(page.getByTestId('step-issues')).toContainText('Add a prompt.')

    await page.getByTestId('field-prompt').fill('What was the safe code in 1998?')
    await page.getByTestId('field-answer').fill('1998')

    await page.getByTestId('advanced-toggle').click()
    await page.getByTestId('field-hint').fill('The year we met.')
    await page.getByTestId('field-success').fill('Correct — you never forget a date.')
    await page.getByTestId('field-attempts').fill('3')

    // Configured steps flip from "needs setup" to ready.
    await expect(card(page, 0)).toContainText('Ready')
    await expect(page.getByTestId('step-issues')).toHaveCount(0)

    // The advanced settings surface in the recipient preview.
    const preview = page.getByTestId('live-preview')
    await expect(preview).toContainText('What was the safe code in 1998?')
    await expect(preview).toContainText('Hint')
    await expect(preview).toContainText('3 attempts')
    await expect(preview).toContainText('Correct — you never forget a date.')
  })

  test('clamps Max Attempts to the supported range', async ({ page }) => {
    await page.goto('/dashboard/quests/new')
    await page.getByTestId('palette-lock').click()
    await page.getByTestId('advanced-toggle').click()

    await page.getByTestId('field-attempts').fill('99')
    await expect(page.getByTestId('field-attempts')).toHaveValue('10')

    await page.getByTestId('field-attempts').fill('')
    await expect(page.getByTestId('field-attempts')).toHaveValue('')
  })

  test('keeps progression strictly linear as steps are reordered', async ({ page }) => {
    await page.goto('/dashboard/quests/new')
    await page.getByTestId('palette-lock').click()
    await page.getByTestId('field-prompt').fill('First step')
    await page.getByTestId('palette-trivia').click()
    await page.getByTestId('field-prompt').fill('Second step')

    await expect(card(page, 0)).toContainText('Plays first')
    await expect(card(page, 1)).toContainText('Locked until Step 1 is solved')

    await page.getByTestId('move-up-1').click()

    // The chain renumbers: what was second now plays first.
    await expect(card(page, 0)).toContainText('Second step')
    await expect(card(page, 0)).toContainText('Plays first')
    await expect(card(page, 1)).toContainText('First step')
    await expect(card(page, 1)).toContainText('Locked until Step 1 is solved')
  })

  test('walks the flow with the wizard and deletes a step', async ({ page }) => {
    await page.goto('/dashboard/quests/new')
    await page.getByTestId('palette-lock').click()
    await page.getByTestId('palette-trivia').click()
    await page.getByTestId('palette-hotspot').click()

    await expect(page.getByTestId('wizard-label')).toHaveText('Step 3 of 3')
    await page.getByTestId('wizard-prev').click()
    await expect(page.getByTestId('wizard-label')).toHaveText('Step 2 of 3')
    await expect(page.getByTestId('wizard-next')).toBeEnabled()

    await page.getByTestId('delete-step-1').click()
    await expect(page.getByTestId('step-count')).toContainText('2')
    await expect(card(page, 1)).toContainText('Image Hotspot')
  })

  test('re-skins the live preview when the theme preset changes', async ({ page }) => {
    await page.goto('/dashboard/quests/new')
    await page.getByTestId('palette-lock').click()

    const preview = page.getByTestId('live-preview')
    await expect(preview).toHaveAttribute('data-theme', 'birthday')

    await page.getByTestId('theme-spooky').click()

    await expect(preview).toHaveAttribute('data-theme', 'spooky')
    await expect(page.getByTestId('theme-birthday')).toHaveAttribute('aria-pressed', 'false')
  })

  test('toggles ambient audio and opening particles', async ({ page }) => {
    await page.goto('/dashboard/quests/new')

    const audio = page.getByTestId('toggle-audio')
    const particles = page.getByTestId('toggle-particles')
    await expect(audio).toHaveAttribute('aria-checked', 'true')
    await expect(particles).toHaveAttribute('aria-checked', 'true')

    await audio.click()
    await particles.click()

    await expect(audio).toHaveAttribute('aria-checked', 'false')
    await expect(particles).toHaveAttribute('aria-checked', 'false')
  })

  test('saves a new quest back onto the dashboard', async ({ page }) => {
    await page.goto('/dashboard/quests/new?occasion=corporate')

    await page.getByTestId('quest-name').fill('Onboarding — Q4')
    await page.getByTestId('palette-lock').click()
    await page.getByTestId('field-prompt').fill('Which floor is the studio on?')
    await page.getByTestId('field-answer').fill('Fourth')
    await page.getByTestId('palette-trivia').click()

    await page.getByTestId('save-quest').click()

    // Saving a new quest claims its edit URL (PRD §8).
    await expect(page).toHaveURL(/\/dashboard\/quests\/\d+\/edit/)

    await page.getByRole('link', { name: /Back to dashboard/i }).click()
    await expect(page.getByRole('heading', { name: 'Onboarding — Q4' })).toBeVisible()
  })

  test('opens an existing quest from its dashboard card', async ({ page }) => {
    await page.goto('/dashboard/quests')

    await page.getByTestId('edit-quest-2').click()

    await expect(page).toHaveURL(/\/dashboard\/quests\/2\/edit/)
    await expect(page.getByTestId('quest-name')).toHaveValue("Mum's 60th")
    // The legacy quest's four stepKinds rehydrate into real, editable steps.
    await expect(page.getByTestId('step-count')).toContainText('4')
    await expect(card(page, 0)).toContainText('Plays first')
  })

  test('redirects to the dashboard for an unknown quest id', async ({ page }) => {
    await page.goto('/dashboard/quests/9999/edit')
    await expect(page).toHaveURL(/\/dashboard\/quests$/)
  })
})

test.describe('Quest Builder — Persian (RTL)', () => {
  test('mirrors the studio and renders localized strings', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /فارسی/ }).click()

    const stage = page.locator('.app-stage')
    await expect(stage).toHaveAttribute('dir', 'rtl')

    // Navigate in-app so the language choice survives (it lives in the store,
    // and a full page load would reset it back to English).
    await page.getByRole('button', { name: 'ورود' }).click()
    await page.getByTestId('new-quest').click()

    await expect(stage).toHaveAttribute('dir', 'rtl')
    await expect(page.getByTestId('flow-canvas')).toContainText('مسیر')

    await page.getByTestId('palette-lock').click()
    await expect(page.getByTestId('step-inspector')).toContainText('تنظیمات گام')
    await expect(card(page, 0)).toContainText('اول اجرا می‌شود')

    // Mirroring must come from logical properties, not a page-wide flip.
    await expect(stage).toHaveCSS('transform', 'none')
  })
})
