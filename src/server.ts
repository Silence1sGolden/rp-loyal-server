import { app } from './app';
import { clearCodes } from './utils/service';

const base_url = process.cwd();
// const options: ServerOptions = {
//   key: fs.readFileSync(base_url + '/cert/localhost.key'),
//   cert: fs.readFileSync(base_url + '/cert/localhost.crt'),
// };

// https
//   .createServer(options, (req, res) => {
//     res.writeHead(200);
//     res.end('hello WORLD');
//   })
//   .listen(8000);

setInterval(clearCodes, 60 * 1000);

app.listen('3000', () => {
  console.log('Server running on port 3000');
});
