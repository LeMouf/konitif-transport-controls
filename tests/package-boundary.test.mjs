import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const expected = {
  repository: 'git+https://github.com/LeMouf/konitif-transport-controls.git',
  dependencies: { '@konitif/tools': '0.284.4' },
};

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    return entry.isDirectory() ? sourceFiles(url) : entry.name.endsWith('.ts') ? [url] : [];
  });
}

test('manifest exposes one public product-neutral package identity', () => {
  assert.equal(manifest.name, '@konitif/transport-controls');
  assert.equal(manifest.version, '0.284.2');
  assert.equal(manifest.private, false);
  assert.equal(manifest.license, 'PolyForm-Noncommercial-1.0.0');
  assert.equal(manifest.repository.url, expected.repository);
  assert.deepEqual(manifest.publishConfig, {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  });
  assert.deepEqual(manifest.dependencies, expected.dependencies);
  assert.deepEqual(manifest.devDependencies, { typescript: '5.9.3' });
  assert.deepEqual(manifest.exports, {
    '.': { types: './dist/index.d.ts', import: './dist/index.js' },
  });

  const lockUrl = new URL('package-lock.json', root);
  if (existsSync(lockUrl)) {
    const lock = JSON.parse(readFileSync(lockUrl, 'utf8'));
    assert.equal(lock.name, manifest.name);
    assert.equal(lock.version, manifest.version);
    assert.deepEqual(lock.packages[''].dependencies, manifest.dependencies);
    assert.deepEqual(lock.packages[''].devDependencies, manifest.devDependencies);
    for (const [path, entry] of Object.entries(lock.packages)) {
      assert.notEqual(entry.link, true, `${path}: local link forbidden in public lockfile`);
      if (entry.resolved) assert.match(entry.resolved, /^https:\/\/registry\.npmjs\.org\//, `${path}: registry archive required`);
    }
  }
});

test('source closure excludes product, framework and hidden local resolution', () => {
  for (const file of sourceFiles(new URL('src/', root))) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /Maxtronics|Behavior Studio|\bNAO(?:qi)?\b|Aldebaran|SoftBank|from ['"]svelte|from ['"]three/i);
    for (const match of source.matchAll(/(?:from|import\s*\()\s*['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (specifier.startsWith('.')) {
        assert.match(specifier, /\.js$/, `${file.pathname}: relative ESM specifier must end in .js: ${specifier}`);
      } else {
        assert.ok(Object.hasOwn(expected.dependencies, specifier), `${file.pathname}: undeclared external import ${specifier}`);
      }
    }
  }
});
