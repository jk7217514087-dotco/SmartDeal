async function checkLoginError() {
  const loginRes = await fetch('https://smartdeal-backend-10kv.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'rahul.sharma@example.com', password: 'password123' })
  });
  console.log('Live /api/auth/login status:', loginRes.status);
  const data = await loginRes.json();
  console.log('Error data:', data);
}
checkLoginError();
