async function run() {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://zeron.app",
        "Referer": "https://zeron.app/"
      },
      body: JSON.stringify({
        access_key: "94bab13c-8bf6-4f17-b2f3-92297938eac8",
        subject: `New ZERON COD Order - ZERON-12345`,
        from_name: "ZERON Storefront",
        message: "Test message from container",
      })
    });
    console.log(res.status);
    console.log(await res.text());
}
run();
