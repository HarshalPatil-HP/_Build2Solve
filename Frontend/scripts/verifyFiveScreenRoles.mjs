import assert from 'node:assert/strict';
import { getPostLoginPath, isBlockedInspector } from '../src/utils/roleGuards.js';

assert.equal(getPostLoginPath({ role: 'user' }), '/scan');
assert.equal(getPostLoginPath({ role: 'company' }), '/scan');
assert.equal(getPostLoginPath({ role: 'inspector', status: 'active' }), '/scan');
assert.equal(getPostLoginPath({ role: 'admin' }), '/admin/dashboard');
assert.equal(getPostLoginPath({ role: 'inspector', status: 'pending' }), '/auth');
assert.equal(getPostLoginPath(null), '/auth');
assert.equal(isBlockedInspector({ role: 'inspector', status: 'pending' }), true);
assert.equal(isBlockedInspector({ role: 'inspector', status: 'rejected' }), true);
console.log('PASS: user/company/active inspector -> /scan; admin -> dashboard; pending/anonymous -> /auth; blocked inspector guard');
