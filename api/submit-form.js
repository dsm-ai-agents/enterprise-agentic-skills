export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, size, workflow, tools, timeline } = req.body;

  if (!name || !email || !company) {
    return res.status(400).json({ error: 'Name, email, and company are required.' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const response = await fetch(`${url}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        company,
        size: size || null,
        workflow: workflow || null,
        tools: tools || null,
        timeline: timeline || null,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Supabase error:', response.status, err);
      return res.status(502).json({ error: 'Failed to save submission.' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Submission error:', e);
    return res.status(500).json({ error: 'Internal error.' });
  }
}