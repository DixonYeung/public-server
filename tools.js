export const keepServerAlive = (req, res) => {
    // create a minimized response for cron job to keep server alive
    res.writeHead(200, {
      'Content-Length': 0,
      'X-Powered-By': '',
      'Date': '',
      'Connection': '',
      'Keep-Alive': ''
    });
    res.end();
};