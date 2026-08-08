import { test, expect } from '@playwright/test'

/**
 * Creator dashboard (PRD §4.2.1). The quest list, its filters and each card's
 * footer actions had no E2E coverage at all, so regressions in the parts a
 * creator touches every session went unseen.
 */

const cardTitles = (page) => page.locator('.quest-card .quest-title')

test.describe('Creator dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/quests')
    await expect(page.locator('.quest-card').first()).toBeVisible()
  })

  test('lands on the quests view and shows the KPI row', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/quests$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Your quests' })).toBeVisible()

    // Four derived KPIs (PRD §4.2.1) — total gifts, plays, completion, solve time.
    await expect(page.locator('.stats-row .stat-card')).toHaveCount(4)
    await expect(page.locator('.stats-row')).toContainText('Total gifts created')
  })

  test('each card carries the occasion, reward type and status', async ({ page }) => {
    const card = page.locator('.quest-card', { hasText: "Mum's 60th" })
    await expect(card.getByTestId('quest-occasion')).toHaveText('Birthday')
    await expect(card.getByTestId('quest-reward')).toHaveText('Voucher')
    await expect(card).toContainText('Published')
  })

  test('the Drafts filter actually returns the drafts', async ({ page }) => {
    const total = await cardTitles(page).count()

    await page.getByRole('button', { name: 'Drafts', exact: true }).click()

    const drafts = cardTitles(page)
    await expect(drafts).not.toHaveCount(0)
    expect(await drafts.count()).toBeLessThan(total)
    for (const card of await page.locator('.quest-card').all()) {
      await expect(card).toContainText('Draft')
    }
  })

  test('the Published filter returns only published quests', async ({ page }) => {
    await page.getByRole('button', { name: 'Published', exact: true }).click()

    await expect(cardTitles(page)).not.toHaveCount(0)
    for (const card of await page.locator('.quest-card').all()) {
      await expect(card).toContainText('Published')
    }
  })

  test('the sort control reorders the grid', async ({ page }) => {
    const sort = page.getByTestId('quest-sort')
    await expect(sort).toContainText('Recent')

    const byRecent = await cardTitles(page).allTextContents()
    await sort.click()

    await expect(sort).toContainText('Name')
    const byName = await cardTitles(page).allTextContents()
    expect(byName).toEqual([...byRecent].sort((a, b) => a.localeCompare(b)))
  })

  test('search narrows the grid', async ({ page }) => {
    await page.getByRole('textbox', { name: /search/i }).fill('offsite')
    await expect(cardTitles(page)).toHaveText(['Team offsite hunt'])
  })

  test('Open takes the creator into the builder for that quest', async ({ page }) => {
    await page.getByTestId('edit-quest-2').click()
    await expect(page).toHaveURL(/\/dashboard\/quests\/2\/edit$/)
    await expect(page.getByTestId('quest-name')).toHaveValue("Mum's 60th")
  })

  test('copy-link puts the player URL on the clipboard and confirms', async ({
    page,
    context,
    browserName
  }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions are Chromium-only here.')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const card = page.locator('.quest-card', { hasText: "Mum's 60th" })
    await card.getByTestId('copy-link-2').click()

    await expect(card.getByTestId('copy-link-2')).toHaveAttribute('title', 'Link copied')
    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboard).toContain('/q/demo2')
  })

  test('a draft offers no copy-link, because it has no URL yet', async ({ page }) => {
    const card = page.locator('.quest-card', { hasText: 'A Year of Us' })
    await expect(card).toContainText('Draft')
    await expect(card.getByTestId('copy-link-1')).toHaveCount(0)
    await expect(card.getByTestId('edit-quest-1')).toBeVisible()
  })

  test('offers every occasion preset in the PRD, mystery included', async ({ page }) => {
    for (const id of ['birthday', 'anniversary', 'holiday', 'mysteryNight', 'corporate', 'blank']) {
      await expect(page.getByTestId(`occasion-${id}`)).toBeVisible()
    }
  })

  test('mirrors the dashboard for Arabic', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Language options' }).click()
    await page.locator('header').getByRole('button', { name: /العربية/ }).click()

    // Navigate INSIDE the SPA — a full load would reset the language store.
    await page.getByRole('button', { name: /تسجيل الدخول|Log in/ }).click()
    await expect(page).toHaveURL(/\/dashboard\/quests$/)

    await expect(page.locator('.app-stage')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('.app-stage')).toHaveClass(/lang-rtl/)
    // Card chrome is translated, not left in English.
    await expect(page.locator('.quest-card').first().getByTestId('quest-reward')).not.toHaveText(
      /Letter|Video|Voucher/
    )
  })
})
