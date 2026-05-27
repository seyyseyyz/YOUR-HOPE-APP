/* YOUR HOPE — Frontend configuration
   Uses localhost while developing, and the deployed Railway API online.
*/

window.CONFIG = {
  apiBase:
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5001/api'
      : 'https://your-hope-app-production.up.railway.app/api',

  geminiKey: 'AIzaSyC3cQLyb8tcaLMKrEiHwLA1ZnhTtTqBmlA'
};
