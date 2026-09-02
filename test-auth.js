const req = { headers: { authorization: 'Bearer abc' } };
const { getUserFromAuthHeader } = require('./dist/server.cjs');
// Wait, getUserFromAuthHeader is not exported!
