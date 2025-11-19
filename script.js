document.getElementById('btn').addEventListener('click', async () => {
  const domain = document.getElementById('domain').value.trim();
  const out = document.getElementById('output');
  if (!domain) {
    out.textContent = 'Введите домен!';
    return;
  }

  out.textContent = 'Загрузка...';

  try {
    const res = await fetch('http://localhost:3000/whois', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    const text = await res.text();
    out.textContent = text;
  } catch (e) {
    out.textContent = 'Ошибка: ' + e;
  }
});