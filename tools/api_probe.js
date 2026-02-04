(async ()=>{
  const url = 'http://localhost:5000/api/auth/register';
  const body = { username: 'apitest', email: 'apitest'+Date.now().toString().slice(-5)+'@example.com', password: 'Password123!' };
  try{
    const res = await fetch(url, {method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const text = await res.text();
    console.log('status', res.status);
    console.log('body', text);
  }catch(e){
    console.error('err', e && e.stack ? e.stack : e.message || e);
  }
})();
