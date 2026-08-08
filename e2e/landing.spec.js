import { test, expect } from '@playwright/test'
import { APP_NAME } from '../src/config/app.js'

test.describe('Public landing page', () => {
  test('loads and shows the hero headline', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(APP_NAME)
    await expect(
      page.getByRole('heading', { name: 'Turn any gift into a mini-escape room.' })
    ).toBeVisible()
  })

  test('switches to the Mystery theme', async ({ page }) => {
    await page.goto('/')
    const stage = page.locator('.app-stage')
    await expect(stage).not.toHaveClass(/theme-mystery/)

    await page.getByRole('button', { name: 'Mystery' }).click()

    await expect(stage).toHaveClass(/theme-mystery/)
  })

  test('switches to Persian and mirrors layout to RTL', async ({ page }) => {
    await page.goto('/')
    const stage = page.locator('.app-stage')
    await expect(stage).toHaveAttribute('dir', 'ltr')

    await page.getByRole('button', { name: 'Language options' }).click()
    // The footer has its own switcher — scope to the header dropdown.
    await page.locator('header').getByRole('button', { name: /فارسی/ }).click()

    await expect(stage).toHaveClass(/lang-fa/)
    await expect(stage).toHaveClass(/lang-rtl/)
    await expect(stage).toHaveAttribute('dir', 'rtl')
    await expect(
      page.getByRole('heading', { name: 'هر هدیه را به یک اتاق فرار کوچک تبدیل کن.' })
    ).toBeVisible()
  })

  test('switches to Arabic and mirrors layout to RTL', async ({ page }) => {
    await page.goto('/')
    const stage = page.locator('.app-stage')
    await expect(stage).toHaveAttribute('dir', 'ltr')

    await page.getByRole('button', { name: 'Language options' }).click()
    await page.locator('header').getByRole('button', { name: /العربية/ }).click()

    await expect(stage).toHaveClass(/lang-ar/)
    await expect(stage).toHaveClass(/lang-rtl/)
    await expect(stage).toHaveAttribute('dir', 'rtl')
    await expect(
      page.getByRole('heading', { name: 'حوّل أي هدية إلى غرفة هروب صغيرة.' })
    ).toBeVisible()

    // The RTL font swap must reach Arabic too, not only Persian.
    await expect(
      page.getByRole('heading', { name: 'حوّل أي هدية إلى غرفة هروب صغيرة.' })
    ).toHaveCSS('font-family', /Vazirmatn/)
  })

  test('closes the language menu when focus leaves it', async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')
    await page.getByRole('button', { name: 'Language options' }).click()

    const option = page.locator('header').getByRole('button', { name: /Svenska/ })
    await expect(option).toBeVisible()

    // Click away onto bare page background — a coordinate, so the sticky header
    // cannot intercept it on a phone viewport.
    await page.mouse.click(4, 400)
    await expect(option).toBeHidden()
    expect(errors).toEqual([])
  })

  test('applies the theme preset as a data attribute, not only a class', async ({ page }) => {
    await page.goto('/')
    const stage = page.locator('.app-stage')
    await expect(stage).toHaveAttribute('data-theme', 'birthday')

    await page.getByRole('button', { name: 'Mystery' }).click()

    await expect(stage).toHaveAttribute('data-theme', 'mystery')
    // The dark preset really repaints the canvas.
    await expect(stage).toHaveCSS('background-color', 'rgb(13, 16, 23)')
  })

  test('shows the Partners section with Wellowork', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: `${APP_NAME} × WelloWork — play your way to a stronger team.` })
    ).toBeVisible()
    const partnerLink = page.getByRole('link', { name: /Explore the partnership/i })
    await expect(partnerLink).toBeVisible()
    await expect(partnerLink).toHaveAttribute('href', 'https://www.wellowork.net/')
  })
})
