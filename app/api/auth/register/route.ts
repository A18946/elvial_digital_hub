export async function POST(req) {
  const DRUPAL_BASE = process.env.DRUPAL_BASE_URL;

  try {
    const body = await req.json();
    const {
      name,
      mail,
      field_first_name,
      field_last_name,
      field_password,
      field_confirm_password,
      field_phone,
      field_choose_roles,
    } = body;

    if (!name || !mail || !field_password || !field_first_name || !field_last_name) {
      return Response.json(
        { message: 'Λείπουν υποχρεωτικά πεδία' },
        { status: 400 }
      );
    }

    // 1. CSRF token
    const tokenRes = await fetch(`${DRUPAL_BASE}/session/token`);
    if (!tokenRes.ok) {
      return Response.json(
        { message: 'Αποτυχία λήψης CSRF token' },
        { status: 502 }
      );
    }
    const csrfToken = await tokenRes.text();

    // 2. Payload με όλα τα custom fields
    const payload = {
      name: [{ value: name }],
      mail: [{ value: mail }],
      pass: [{ value: field_password }],          // Drupal login password
      field_first_name: [{ value: field_first_name }],
      field_last_name: [{ value: field_last_name }],
      field_password: [{ value: field_password }], // custom string field
      field_confirm_password: [{ value: field_confirm_password }],
      field_phone: [{ value: field_phone }],
      field_choose_roles: [{ value: field_choose_roles }],
    };

    // 3. Στέλνουμε στο Drupal
    const registerRes = await fetch(`${DRUPAL_BASE}/user/register?_format=json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(payload),
    });

    const rawText = await registerRes.text();
    console.log('Drupal raw response:', rawText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      return Response.json(
        { message: 'Drupal error: ' + rawText.substring(0, 200) },
        { status: 502 }
      );
    }

    if (!registerRes.ok) {
      return Response.json(
        { message: data.message || 'Η εγγραφή απέτυχε', errors: data },
        { status: registerRes.status }
      );
    }

    return Response.json({
      message: 'Επιτυχής εγγραφή',
      uid: data.uid?.[0]?.value,
      uuid: data.uuid?.[0]?.value,
    });

  } catch (err) {
    console.error('Register error:', err);
    return Response.json({ message: 'Εσωτερικό σφάλμα' }, { status: 500 });
  }
}