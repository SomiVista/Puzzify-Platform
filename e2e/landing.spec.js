import { test, expect } from '@playwright/test'

test.describe('Public landing page', () => {
  test('loads and shows the hero headline', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Puzzify/)
    await expect(
      page.getByRole('heading', { name: 'Turn any gift into a mini-escape room.' })
    ).toBeVisible()
  })

  test('switches to the Mystery theme', async ({ page }) => {
    await page.goto('/')
    const stage = page.locator('.pz-stage')
    await expect(stage).not.toHaveClass(/pz-theme-mystery/)

    await page.getByRole('button', { name: 'Mystery' }).click()

    await expect(stage).toHaveClass(/pz-theme-mystery/)
  })

  test('switches to Persian and mirrors layout to RTL', async ({ page }) => {
    await page.goto('/')
    const stage = page.locator('.pz-stage')
    await expect(stage).toHaveAttribute('dir', 'ltr')

    await page.getByRole('button', { name: /فارسی/ }).click()

    await expect(stage).toHaveClass(/pz-lang-fa/)
    await expect(stage).toHaveAttribute('dir', 'rtl')
    await expect(
      page.getByRole('heading', { name: 'هر هدیه را به یک اتاق فرار کوچک تبدیل کن.' })
    ).toBeVisible()
  })
})
