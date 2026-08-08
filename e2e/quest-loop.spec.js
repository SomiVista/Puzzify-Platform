import { test, expect } from '@playwright/test'

/**
 * The whole product loop: build a quest → publish it → open the link as the
 * recipient → solve every step → unlock the reward → hit the viral CTA.
 * (PRD §4.2.5, §4.3, §4.4, §4.5, §5.2)
 */

/** Build and publish a two-step quest, returning its /q/{id} link. */
async function buildAndPublish(page, { maxAttempts = '' } = {}) {
  await page.goto('/dashboard/quests/new?occasion=mysteryNight')
  await page.getByTestId('quest-name').fill('The Vault')

  // Step 1 — text lock, with the per-step advanced settings filled in.
  await page.getByTestId('palette-lock').click()
  await page.getByTestId('field-prompt').fill('What year did we meet?')
  await page.getByTestId('field-answer').fill('2020')
  await page.getByTestId('advanced-toggle').click()
  await page.getByTestId('field-hint').fill('The year everything changed.')
  await page.getByTestId('field-success').fill('You never forget that year.')
  if (maxAttempts) await page.getByTestId('field-attempts').fill(maxAttempts)

  // Step 2 — trivia.
  await page.getByTestId('palette-trivia').click()
  await page.getByTestId('field-prompt').fill('Our song?')
  await page.getByTestId('option-text-0').fill('Blue')
  await page.getByTestId('option-text-1').fill('Gold')
  await page.getByTestId('option-correct-1').check()

  // The reward waiting at the end.
  await page.getByTestId('reward-letter').click()
  await page.getByTestId('reward-headline').fill('Happy anniversary, love.')
  await page.getByTestId('reward-message').fill('Dinner is booked for Friday at eight.')

  await expect(page.getByTestId('publish-quest')).toBeEnabled()
  await page.getByTestId('publish-quest').click()

  await expect(page.getByTestId('share-row')).toBeVisible()
  const url = await page.getByTestId('share-link').textContent()
  return new URL(url.trim()).pathname
}

test.describe('Build → publish → play → reward', () => {
  test('a recipient can solve a published quest and unlock the reward', async ({ page }) => {
    const path = await buildAndPublish(page)
    expect(path).toMatch(/^\/q\/[a-z0-9]{20,}$/)

    await page.goto(path)

    // Step 1 of 2 — strictly linear, so this is where everyone starts.
    await expect(page.getByTestId('step-count')).toHaveText('Step 1 of 2')
    await expect(page.getByTestId('step-prompt')).toHaveText('What year did we meet?')

    await page.getByTestId('answer-input').fill('2020')
    await page.getByTestId('submit-answer').click()

    // The creator's success message greets the correct answer.
    await expect(page.getByTestId('success-toast')).toHaveText(/You never forget that year\./)
    await expect(page.getByTestId('step-count')).toHaveText('Step 2 of 2')

    await page.getByTestId('option-1').click()
    await page.getByTestId('submit-answer').click()

    // Grand Finale mounts only now (PRD §4.4).
    const finale = page.getByTestId('grand-finale')
    await expect(finale).toBeVisible()
    await expect(finale).toContainText('Happy anniversary, love.')
    await expect(page.getByTestId('reward-letter')).toContainText('Dinner is booked for Friday at eight.')
    await expect(page.getByTestId('viral-cta')).toBeVisible()
  })

  test('rejects a wrong answer without advancing', async ({ page }) => {
    const path = await buildAndPublish(page)
    await page.goto(path)

    await page.getByTestId('answer-input').fill('1999')
    await page.getByTestId('submit-answer').click()

    await expect(page.getByTestId('wrong-answer')).toBeVisible()
    await expect(page.getByTestId('step-count')).toHaveText('Step 1 of 2')
    await expect(page.getByTestId('grand-finale')).toHaveCount(0)
  })

  test('forgives sloppy spacing and casing', async ({ page }) => {
    const path = await buildAndPublish(page)
    await page.goto(path)

    await page.getByTestId('answer-input').fill('  2020 ')
    await page.getByTestId('submit-answer').click()

    await expect(page.getByTestId('step-count')).toHaveText('Step 2 of 2')
  })

  test('reveals the hint only when asked', async ({ page }) => {
    const path = await buildAndPublish(page)
    await page.goto(path)

    await expect(page.getByTestId('hint-text')).toHaveCount(0)
    await page.getByTestId('hint-button').click()
    await expect(page.getByTestId('hint-text')).toHaveText('The year everything changed.')
  })

  test('counts down attempts and locks the step when they run out', async ({ page }) => {
    const path = await buildAndPublish(page, { maxAttempts: '2' })
    await page.goto(path)

    await expect(page.getByTestId('attempts-left')).toHaveText('2 tries left')

    await page.getByTestId('answer-input').fill('1999')
    await page.getByTestId('submit-answer').click()
    await expect(page.getByTestId('attempts-left')).toHaveText('Last try')

    await page.getByTestId('answer-input').fill('1998')
    await page.getByTestId('submit-answer').click()

    // Locked, but never permanently bricked — a restart is always offered.
    await expect(page.getByTestId('locked-out')).toBeVisible()
    await expect(page.getByTestId('answer-input')).toHaveCount(0)

    await page.getByTestId('restart').click()
    await expect(page.getByTestId('step-count')).toHaveText('Step 1 of 2')
    await expect(page.getByTestId('answer-input')).toBeVisible()
  })

  test('resumes at the furthest unlocked step after the tab is closed', async ({ page }) => {
    const path = await buildAndPublish(page)
    await page.goto(path)

    await page.getByTestId('answer-input').fill('2020')
    await page.getByTestId('submit-answer').click()
    await expect(page.getByTestId('step-count')).toHaveText('Step 2 of 2')

    await page.reload()

    await expect(page.getByTestId('step-count')).toHaveText('Step 2 of 2')
    await expect(page.getByTestId('step-prompt')).toHaveText('Our song?')
  })

  test('never ships the answer or the reward in the initial payload', async ({ page }) => {
    const path = await buildAndPublish(page)
    await page.goto(path)

    const payloads = await page.evaluate(() =>
      Object.keys(localStorage)
        .filter((key) => key.startsWith('app.play.'))
        .map((key) => localStorage.getItem(key))
        .join('')
    )

    expect(payloads).not.toContain('2020')
    expect(payloads).not.toContain('Dinner is booked')
    // What it does carry is a SHA-256 digest.
    expect(payloads).toMatch(/"digest":"[0-9a-f]{64}"/)
  })

  test('shows a dead-link screen for an unknown quest id', async ({ page }) => {
    await page.goto('/q/does-not-exist')
    await expect(page.getByTestId('player-not-found')).toBeVisible()
  })

  test('applies the quest theme, not the studio theme', async ({ page }) => {
    const path = await buildAndPublish(page)
    await page.goto(path)

    // Mystery night seeded the mystery preset at build time.
    await expect(page.locator('.player')).toHaveAttribute('data-theme', 'mystery')
  })

  test('the published quest appears on the dashboard', async ({ page }) => {
    await buildAndPublish(page)
    await page.goto('/dashboard/quests')

    const card = page.locator('.quest-card', { hasText: 'The Vault' })
    await expect(card).toBeVisible()
    await expect(card).toContainText('Published')
  })

  test('a saved quest survives a full reload of the dashboard', async ({ page }) => {
    await buildAndPublish(page)
    await page.goto('/dashboard/quests')
    await page.reload()

    await expect(page.locator('.quest-card', { hasText: 'The Vault' })).toBeVisible()
  })
})
