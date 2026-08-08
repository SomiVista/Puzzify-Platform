import { describe, it, expect } from 'vitest'
import {
  parseVersion,
  compareVersions,
  latestReleasedVersion,
  resolveNextVersion
} from './next-version.mjs'

const SHIPPED = ['v1.0.1', 'v1.1.1', 'v1.1.2', 'v1.1.3', 'v1.1.4', 'v1.1.5', 'v1.1.6']

describe('parseVersion', () => {
  it('accepts tags with and without the v prefix', () => {
    expect(parseVersion('v1.2.3')).toEqual([1, 2, 3])
    expect(parseVersion('1.2.3')).toEqual([1, 2, 3])
  })

  it('rejects anything that is not a release version', () => {
    for (const value of ['v1.2', 'latest', 'v1.2.3-rc.1', '', null, undefined]) {
      expect(parseVersion(value)).toBeNull()
    }
  })
})

describe('compareVersions', () => {
  it('orders numerically, not lexically', () => {
    expect(compareVersions('1.1.10', '1.1.9')).toBeGreaterThan(0)
    expect(compareVersions('1.10.0', '1.9.0')).toBeGreaterThan(0)
    expect(compareVersions('2.0.0', '1.99.99')).toBeGreaterThan(0)
    expect(compareVersions('1.1.6', '1.1.6')).toBe(0)
  })
})

describe('latestReleasedVersion', () => {
  it('picks the highest release tag', () => {
    expect(latestReleasedVersion(SHIPPED)).toBe('1.1.6')
  })

  it('ignores tags that are not releases', () => {
    expect(latestReleasedVersion(['v1.1.6', 'nightly', 'v2.0.0-rc.1'])).toBe('1.1.6')
  })

  it('starts from 0.0.0 on a repo with no releases', () => {
    expect(latestReleasedVersion([])).toBe('0.0.0')
  })
})

describe('resolveNextVersion', () => {
  /**
   * The regression this whole module exists for: PR #11 branched before the
   * v1.1.6 release, so merging it reverted package.json to 1.1.5. Deriving the
   * next version from package.json produced v1.1.6 a second time and the
   * release failed with HTTP 422 "Release.tag_name already exists".
   */
  it('never re-derives a version that is already tagged', () => {
    const { version, tag } = resolveNextVersion({ pkgVersion: '1.1.5', tags: SHIPPED })
    expect(version).toBe('1.1.7')
    expect(SHIPPED).not.toContain(tag)
  })

  it('patch-bumps from the latest tag when package.json is in step', () => {
    expect(resolveNextVersion({ pkgVersion: '1.1.6', tags: SHIPPED }).version).toBe('1.1.7')
  })

  it('honours a deliberate minor bump made in the PR', () => {
    const result = resolveNextVersion({ pkgVersion: '1.2.0', tags: SHIPPED })
    expect(result.version).toBe('1.2.0')
    expect(result.reason).toMatch(/ahead/)
  })

  it('honours a deliberate major bump made in the PR', () => {
    expect(resolveNextVersion({ pkgVersion: '2.0.0', tags: SHIPPED }).version).toBe('2.0.0')
  })

  it('releases the first version on an untagged repo', () => {
    expect(resolveNextVersion({ pkgVersion: '1.1.5', tags: [] }).version).toBe('1.1.5')
    expect(resolveNextVersion({ pkgVersion: '0.0.0', tags: [] }).version).toBe('0.0.1')
  })

  it('always returns a tag that does not exist yet', () => {
    // Whatever package.json says, the result must be unused.
    for (const pkgVersion of ['1.0.0', '1.1.1', '1.1.5', '1.1.6', '1.1.7', '9.9.9']) {
      const { tag } = resolveNextVersion({ pkgVersion, tags: SHIPPED })
      expect(SHIPPED, `pkg ${pkgVersion} reused ${tag}`).not.toContain(tag)
    }
  })

  it('rejects a package.json without a usable version', () => {
    expect(() => resolveNextVersion({ pkgVersion: 'nope', tags: SHIPPED })).toThrow(/no usable version/)
  })
})
