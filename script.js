const SHEET_ID = '1zf4G3sIrFntv7DVcKhf0aZkQXo-ayiRuWFL9L2yfCr4';
const SHEET_NAME = '素材';
const SHEETS_URL = `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;

const state = {
  rows: [],
  filteredRows: [],
  sortKey: '',
  sortDir: 'asc',
  filters: {
    search: '',
    category: '',
    color: '',
    rank: ''
  }
};

const rankOrder = ['', 'E', 'D', 'C', 'B', 'A', 'S'];

const els = {
  searchInput: document.getElementById('searchInput'),
  categorySelect: document.getElementById('categorySelect'),
  colorSelect: document.getElementById('colorSelect'),
  rankSelect: document.getElementById('rankSelect'),
  resetButton: document.getElementById('resetButton'),
  tableBody: document.getElementById('tableBody'),
  countInfo: document.getElementById('countInfo'),
  sortInfo: document.getElementById('sortInfo'),
  sortButtons: Array.from(document.querySelectorAll('[data-sort]'))
};

function normalizeText(value) {
  return String(value ?? '').trim();
}

function toNumber(value) {
  const num = Number(String(value ?? '').replace(/,/g, '').trim());
  return Number.isFinite(num) ? num : 0;
}

function splitTags(value) {
  return normalizeText(value)
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

function parseRow(row) {
  return {
    name: normalizeText(row['アイテム名']),
    price: toNumber(row['価格']),
    color: normalizeText(row['色']),
    rank: normalizeText(row['ランク']).toUpperCase(),
    categories: splitTags(row['カテゴリ']),
    quality: toNumber(row['品質']),
    traits: splitTags(row['特性']),
    count: toNumber(row['個数'])
  };
}

function compareValues(a, b, key, dir) {
  const mul = dir === 'asc' ? 1 : -1;

  if (key === 'rank') {
    return (rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)) * mul;
  }

  if (['price', 'quality', 'count'].includes(key)) {
    return (a[key] - b[key]) * mul;
  }

  return String(a[key]).localeCompare(String(b[key]), 'ja') * mul;
}

loadData();