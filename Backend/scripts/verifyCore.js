// Offline regression checks for deterministic backend logic. Run this even
// when Atlas is unavailable; database-backed verification is test:models.
const assert = require('node:assert/strict');
const { getPagination } = require('../src/utils/pagination.util');
const { getImageDimensions } = require('../src/utils/imageDimensions.util');
const { getMinFontMm } = require('../src/services/ruleEngine.service');
const { signupSchema } = require('../src/validators/auth.validator');

assert.deepEqual(getPagination({}), { page: 1, limit: 20, skip: 0 });
assert.deepEqual(getPagination({ page: '-2', limit: '999' }), { page: 1, limit: 100, skip: 0 });
assert.equal(getMinFontMm(50, false), 1);
assert.equal(getMinFontMm(50.01, false), 1.5);
assert.equal(getMinFontMm(5001, true), 6);

const png = Buffer.alloc(24);
Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, 0);
png.writeUInt32BE(640, 16);
png.writeUInt32BE(480, 20);
assert.deepEqual(getImageDimensions(png), { width: 640, height: 480 });

assert.equal(signupSchema.validate({ name: 'A User', email: 'a@example.com', password: 'password123', role: 'admin' }).error !== undefined, true);
assert.equal(signupSchema.validate({ name: 'A User', email: 'a@example.com', password: 'password123', role: 'user' }).error, undefined);

console.log('Offline core verification PASSED');
