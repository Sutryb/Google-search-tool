const request = require('supertest');
const app = require('../src/app');
const { searchGoogle } = require('../src/services/googleSearch');

// Mockujeme volání Google API, aby testy nebyly závislé na internetu
jest.mock('../src/services/googleSearch');

const mockResults = [
  {
    position: 1,
    title: 'Výsledek č. 1',
    url: 'https://example.com/page1',
    displayUrl: 'example.com',
    description: 'Popis prvního výsledku',
    searchedAt: '2025-01-01T10:00:00.000Z',
    query: 'test dotaz',
  },
  {
    position: 2,
    title: 'Výsledek č. 2',
    url: 'https://example2.com/page2',
    displayUrl: 'example2.com',
    description: 'Popis druhého výsledku',
    searchedAt: '2025-01-01T10:00:00.000Z',
    query: 'test dotaz',
  },
];

// ─────────────────────────────────────────────
//  TEST 1: Chybějící parametr q → 400
// ─────────────────────────────────────────────
test('Vrátí 400 když chybí parametr q', async () => {
  const res = await request(app).get('/api/search');
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('error');
});

// ─────────────────────────────────────────────
//  TEST 2: Prázdný parametr q → 400
// ─────────────────────────────────────────────
test('Vrátí 400 pro prázdný parametr q', async () => {
  const res = await request(app).get('/api/search?q=');
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('error');
});

// ─────────────────────────────────────────────
//  TEST 3: Validní dotaz → 200 + pole výsledků
// ─────────────────────────────────────────────
test('Vrátí 200 a pole výsledků pro validní dotaz', async () => {
  searchGoogle.mockResolvedValue(mockResults);

  const res = await request(app).get('/api/search?q=test+dotaz');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(2);
});

// ─────────────────────────────────────────────
//  TEST 4: Výsledky mají správnou strukturu
// ─────────────────────────────────────────────
test('Každý výsledek má správná povinná pole', async () => {
  searchGoogle.mockResolvedValue(mockResults);

  const res = await request(app).get('/api/search?q=seo');
  expect(res.status).toBe(200);

  res.body.forEach((item) => {
    expect(item).toHaveProperty('position');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('url');
    expect(item).toHaveProperty('displayUrl');
    expect(item).toHaveProperty('description');
    expect(item).toHaveProperty('query');
  });
});

// ─────────────────────────────────────────────
//  TEST 5: Pozice jsou sekvenční (1, 2, 3...)
// ─────────────────────────────────────────────
test('Pozice výsledků jsou sekvenční od 1', async () => {
  const tenResults = Array.from({ length: 10 }, (_, i) => ({
    position: i + 1,
    title: `Výsledek ${i + 1}`,
    url: `https://site${i + 1}.cz`,
    displayUrl: `site${i + 1}.cz`,
    description: `Popis ${i + 1}`,
    searchedAt: new Date().toISOString(),
    query: 'keyword',
  }));

  searchGoogle.mockResolvedValue(tenResults);

  const res = await request(app).get('/api/search?q=keyword');
  expect(res.status).toBe(200);
  expect(res.body.length).toBe(10);

  res.body.forEach((item, index) => {
    expect(item.position).toBe(index + 1);
  });
});

// ─────────────────────────────────────────────
//  TEST 6: URL výsledků jsou validní
// ─────────────────────────────────────────────
test('URL výsledků jsou platné http/https adresy', async () => {
  searchGoogle.mockResolvedValue(mockResults);

  const res = await request(app).get('/api/search?q=test');
  expect(res.status).toBe(200);

  res.body.forEach((item) => {
    expect(item.url).toMatch(/^https?:\/\/.+/);
  });
});

// ─────────────────────────────────────────────
//  TEST 7: Chyba Google API → 500
// ─────────────────────────────────────────────
test('Vrátí 500 pokud Google API selže', async () => {
  searchGoogle.mockRejectedValue(new Error('Google API error'));

  const res = await request(app).get('/api/search?q=cokoliv');
  expect(res.status).toBe(500);
  expect(res.body).toHaveProperty('error');
});
