export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, size, workflow, tools, timeline } = req.body;

  if (!name || !email || !company) {
    return res.status(400).json({ error: 'Name, email, and company are required.' });
  }

  const token = process.env.NOCODB_API_TOKEN;
  const tableId = process.env.NOCODB_TABLE_ID;

  if (!token || !tableId) {
    console.error('Missing NOCODB_API_TOKEN or NOCODB_TABLE_ID');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const response = await fetch(
      `https://app.nocodb.com/api/v2/tables/${tableId}/records`,
      {
        method: 'POST',
        headers: {
          'xc-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Company: company,
          Size: size || '',
          Workflow: workflow || '',
          Tools: tools || '',
          Timeline: timeline || '',
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('NocoDB error:', err);
      return res.status(502).json({ error: 'Failed to save submission.' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Submission error:', e);
    return res.status(500).json({ error: 'Internal error.' });
  }
}