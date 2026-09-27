async function test() {
  const res = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test_quick_" + Date.now() + "@jahitflow.test",
      password: "Password123!",
      name: "Audit Tailor",
      businessName: "Audit Shop",
      phone: "081299990001",
      address: "Jl. Audit No. 1, Jakarta"
    })
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Body:", data);
}
test();
