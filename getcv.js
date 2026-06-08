import https from 'https';

https.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTQuAMeW0sBg_sGwT0sMshAYlKdAMmO8qF_JiNXrOuqxEOgXKDDEry-Glse-eP-RRKP9OFOhoSdW671/pub?output=csv', (res) => {
  let data = '';
  res.on('data', (d) => data += d);
  res.on('end', () => console.log(data.split('\n')[0]));
});
