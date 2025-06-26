const fetch = require('node-fetch');

async function getPosts(tag) {
  const url = \`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=\${tag}\`;
  const res = await fetch(url);
  const data = await res.json();
  return data.map(p => ({
    file_url: p.file_url,
    sample_url: p.sample_url,
    score: p.score
  }));
}

async function getRandomPost() {
  const random = Math.floor(Math.random() * 1000);
  const url = \`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1&pid=\${random}\`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    file_url: data[0].file_url,
    sample_url: data[0].sample_url,
    score: data[0].score
  };
}

module.exports = { getPosts, getRandomPost };
