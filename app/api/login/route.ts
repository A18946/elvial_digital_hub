export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const DRUPAL_BASE = process.env.DRUPAL_BASE_URL;

    // Βήμα 1: CSRF token
    const tokenRes = await fetch(`${DRUPAL_BASE}/session/token`, {
      cache: "no-store",
    });
    const csrfToken = await tokenRes.text();

    // Βήμα 2: Αν είναι email, βρες το username πρώτα
    let loginName = username;

   if (username.includes("@")) {

  const lookupRes = await fetch(
    "https://darkcyan-koala-320694.hostingersite.com/api/user-by-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
      }),
    }
  );

  const lookup = await lookupRes.json();
  
  if (lookup.username) {
    loginName = lookup.username;
  }
}

    // Βήμα 3: Login με username
    const res = await fetch(`${DRUPAL_BASE}/user/login?_format=json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken.trim(),
      },
      body: JSON.stringify({
        name: loginName,
        pass: password,
      }),
    });

    console.log("LOGIN STATUS:", res.status);
    const data = await res.json();
    console.log("LOGIN DATA:", data);

    if (!res.ok) {
      return Response.json(
        { error: data.message || "Login failed" },
        { status: 401 }
      );
    }

    return Response.json({
      token: data.csrf_token,
      logout_token: data.logout_token,
      uid: data.current_user?.uid,
      name: data.current_user?.name,
      roles: data.current_user?.roles,
    });

  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}