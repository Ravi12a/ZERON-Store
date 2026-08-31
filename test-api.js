import { app } from './api.js';
app.listen(8081, () => {
  console.log("Listening on 8081");
  process.exit(0);
});
