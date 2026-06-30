export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Βήμα 1: Πάρε CSRF token
    const tokenRes = await fetch(
      "https://darkcyan-koala-320694.hostingersite.com/session/token",
      { cache: "no-store" }
    );
    const csrfToken = await tokenRes.text();

    // Βήμα 2: Κάνε login
    const res = await fetch(
      "https://darkcyan-koala-320694.hostingersite.com/user/login?_format=json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken.trim(),
        },
        body: JSON.stringify({
          name: username,
          pass: password,
        }),
      }
    );

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