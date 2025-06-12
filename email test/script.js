async function generateEmail() {
  const prompt = document.getElementById('prompt').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "작성 중입니다...";

  // 여기에 본인의 OpenAI API 키를 입력하세요.
  const apiKey = "YOUR_OPENAI_API_KEY";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "너는 이메일 작성 도우미야. 사용자가 입력한 설명에 맞는 이메일 초안을 공손하고 자연스럽게 작성해줘." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (response.ok) {
    const data = await response.json();
    const email = data.choices[0].message.content.trim();
    resultDiv.innerHTML = `<b>이메일 초안:</b><br><pre>${email}</pre>`;
  } else {
    resultDiv.innerHTML = "이메일 생성에 실패했습니다.";
  }
}
