/**
 * Decide which version the next release should carry.
 *
 * The released git TAGS are the source of truth for "what already shipped" —
 * not `package.json`. A feature branch cut before a release carries an older
 * `package.json`, and merging it silently reverts the version on `main`; using
 * that number would re-derive a version that is already tagged and the release
 * would fail with "Release.tag_name already exists".
 *
 * `package.json` still wins when it is AHEAD of every tag, which is how a
 * deliberate minor/major bump made inside a PR reaches a release (CLAUDE.md §4).
 */

const SEMVER = /^v?(\d+)\.(\d+)\.(\d+)$/

/** Parse `v1.2.3` / `1.2.3` into `[1,2,3]`, or null when it is not a release tag. */
export function parseVersion(value) {
  const match = SEMVER.exec(String(value ?? '').trim())
  return match ? match.slice(1, 4).map(Number) : null
}

/** Negative when a < b, positive when a > b, 0 when equal. */
export function compareVersions(a, b) {
  const left = parseVersion(a)
  const right = parseVersion(b)
  if (!left || !right) throw new Error(`Not a semantic version: ${!left ? a : b}`)
  for (let i = 0; i < 3; i += 1) {
    if (left[i] !== right[i]) return left[i] - right[i]
  }
  return 0
}

/** The highest `vX.Y.Z` tag, or `0.0.0` when nothing has been released yet. */
export function latestReleasedVersion(tags = []) {
  return tags
    .map((tag) => parseVersion(tag))
    .filter(Boolean)
    .map((parts) => parts.join('.'))
    .sort(compareVersions)
    .at(-1) ?? '0.0.0'
}

/**
 * @param {{ pkgVersion: string, tags: string[] }} input
 * @returns {{ version: string, tag: string, latest: string, reason: string }}
 */
export function resolveNextVersion({ pkgVersion, tags = [] }) {
  const latest = latestReleasedVersion(tags)

  if (!parseVersion(pkgVersion)) {
    throw new Error(`package.json has no usable version: ${pkgVersion}`)
  }

  // A deliberate bump in the PR: honour it exactly, no extra patch bump.
  if (compareVersions(pkgVersion, latest) > 0) {
    return {
      version: pkgVersion,
      tag: `v${pkgVersion}`,
      latest,
      reason: `package.json (${pkgVersion}) is ahead of the latest tag (v${latest})`
    }
  }

  const [major, minor, patch] = parseVersion(latest)
  const version = `${major}.${minor}.${patch + 1}`
  return {
    version,
    tag: `v${version}`,
    latest,
    reason: `patch bump from the latest tag v${latest} (package.json was ${pkgVersion})`
  }
}

/* ── CLI ──────────────────────────────────────────────────────────────
   Used by .github/workflows/release.yml. Prints `version` and `tag` as
   KEY=VALUE lines, ready to append to $GITHUB_OUTPUT.                   */
if (process.argv[1] && process.argv[1].endsWith('next-version.mjs')) {
  const { readFileSync } = await import('node:fs')
  const { execSync } = await import('node:child_process')

  const pkgVersion = JSON.parse(readFileSync('package.json', 'utf8')).version
  const tags = execSync('git tag --list', { encoding: 'utf8' }).split('\n').filter(Boolean)

  const result = resolveNextVersion({ pkgVersion, tags })

  if (tags.includes(result.tag)) {
    console.error(`Refusing to republish: ${result.tag} already exists.`)
    process.exit(1)
  }

  console.error(`Releasing ${result.tag} — ${result.reason}`)
  console.log(`version=${result.version}`)
  console.log(`tag=${result.tag}`)
}
