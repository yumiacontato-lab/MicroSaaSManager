import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url?.split('?')[0] || '/api';

  try {
    // Always-available health endpoint
    if (path === '/api' || path === '/api/health') {
      return res.status(200).json({
        status: 'ok',
        mode: 'vercel-serverless',
        timestamp: new Date().toISOString(),
      });
    }

    // Keep legacy links from crashing in production
    if (path === '/api/login' && req.method === 'GET') {
      return res.redirect('/');
    }

    if (path === '/api/logout' && req.method === 'GET') {
      return res.redirect('/');
    }

    // Public auth probe used by the frontend: anonymous users are expected.
    if (path === '/api/auth/user' && req.method === 'GET') {
      return res.status(200).json(null);
    }

    // Default for unimplemented endpoints in this serverless shim
    return res.status(501).json({
      message: 'Endpoint not available in current serverless mode',
      path,
    });
  } catch (error: any) {
    console.error('API Handler Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      details: error?.message || 'unknown_error',
    });
  }
}
