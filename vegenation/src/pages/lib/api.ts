// lib/api.ts

export const fetchPrediction = async (commodity: string, days: number) => {
  const res = await fetch(
    `https://pblpnj.lokatani.id/vegenation/lstm/predict?comodity=${commodity}&num_days=${days}`
  );
  return res.json();
};

export const fetchArticles = async () => {
  const res = await fetch('https://pblpnj.lokatani.id/vegenation/get_articles');
  return res.json();
};

export const sendChatMessage = async (message: string) => {
  const res = await fetch('https://pblpnj.lokatani.id/vegenation/chatbot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json(); // { response: "..." }
};
