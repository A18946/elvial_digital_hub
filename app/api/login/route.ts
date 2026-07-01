export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const DRUPAL_BASE = process.env.DRUPAL_BASE_URL;

    // Βήμα 1: CSRF token
    const tokenRes = await fetch(`${DRUPAL_BASE}/session/token`, {
      cache: "no-store",
    });
    const csrfToken = await tokenRes.text();

    // Βήμα 2: Αν μοιάζει με email, βρες το username πρώτα
    let loginName = username;

    if (username.includes("@")) {
  const credentials = Buffer.from(
    `${process.env.DRUPAL_ADMIN_USER}:${process.env.DRUPAL_ADMIN_PASS}`
  ).toString("base64");

  const userLookup = await fetch(
    `${DRUPAL_BASE}/jsonapi/user/user?filter[mail]=${encodeURIComponent(username)}&fields[user--user]=name`,
    {
      headers: {
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Basic ${credentials}`,
      },
      cache: "no-store",
    }
  );

  console.log("USER LOOKUP STATUS:", userLookup.status);
  const userData = await userLookup.json();
  console.log("USER LOOKUP DATA:", JSON.stringify(userData?.data?.[0]));

  const foundName = userData?.data?.[0]?.attributes?.name;
  if (foundName) {
    loginName = foundName;
  } else {
    return Response.json(
      { error: "Δεν βρέθηκε χρήστης με αυτό το email" },
      { status: 401 }
    );
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