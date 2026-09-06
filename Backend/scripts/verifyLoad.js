require('dotenv').config();
const app = require('../src/app');

const routes = [];
const stack = app._router?.stack || [];
stack.forEach((layer) => {
  if (layer.route) routes.push(Object.keys(layer.route.methods)[0].toUpperCase() + ' ' + layer.route.path);
  else if (layer.name === 'router' && layer.handle?.stack) {
    const prefix = layer.regexp.source.replace('\\/?(?=\\/|$)', '').replace(/\\\//g, '/').replace(/\^|\$/g, '');
    layer.handle.stack.forEach((r) => {
      if (r.route) routes.push(Object.keys(r.route.methods)[0].toUpperCase() + ' ' + prefix + r.route.path);
    });
  }
});

console.log('App loaded OK');
console.log('Registered routes:', routes.length ? routes.join(', ') : '(nested routers mounted)');

process.exit(0);
