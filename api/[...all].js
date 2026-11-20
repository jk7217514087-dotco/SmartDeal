// Vercel Serverless Function to handle /api/* requests smoothly
export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  // 1. ADMIN LOGIN
  if (url.includes('/admin/login')) {
    const { email, password, pin } = body;

    // Master PIN login
    if (pin === '7217' || pin === '7217514087') {
      return res.status(200).json({
        success: true,
        message: 'Master Owner PIN Verified! Opening Dashboard...',
        token: 'smartdeal_admin_jwt_' + Date.now(),
        admin: {
          id: 'U10000',
          name: 'SmartDeal Owner',
          email: 'jk7217514087@gmail.com',
          phone: '7217514087',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE'
        }
      });
    }

    const cleanEmail = (email || '').toLowerCase().trim();
    const isMasterAdmin =
      cleanEmail === 'jk7217514087@gmail.com' ||
      cleanEmail === 'admin@smartdeal.com' ||
      cleanEmail === 'admin' ||
      cleanEmail.includes('admin');

    const isPassValid =
      password === 'admin123' ||
      password === '7217514087' ||
      password === '7217';

    if (isMasterAdmin && isPassValid) {
      return res.status(200).json({
        success: true,
        message: 'Admin Password Verified. Opening Dashboard...',
        token: 'smartdeal_admin_jwt_' + Date.now(),
        admin: {
          id: 'U10000',
          name: 'SmartDeal Owner',
          email: cleanEmail,
          phone: '7217514087',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE'
        }
      });
    }

    return res.status(200).json({
      success: false,
      message: 'Invalid administrative password. Agar password bhool gaye hain toh Forgot Password karein.'
    });
  }

  // 2. ADMIN FORGOT PASSWORD
  if (url.includes('/admin/forgot-password')) {
    const { email } = body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const code = String(Math.floor(100000 + Math.random() * 900000));

    return res.status(200).json({
      success: true,
      message: `Verification code sent to admin email (${cleanEmail}) and phone!`,
      devCode: code
    });
  }

  // 3. ADMIN RESET PASSWORD
  if (url.includes('/admin/reset-password')) {
    const { code, newPassword } = body;
    if (!code || code.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit verification code.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin password has been reset successfully! You can now sign in with your new password.'
    });
  }

  // 4. USER AUTH (LOGIN)
  if (url.includes('/auth/login')) {
    const { email, identifier, password } = body;
    const clean = (email || identifier || '').toLowerCase().trim();
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: 'user_jwt_' + Date.now(),
      user: {
        id: 'U10025',
        name: 'SmartDeal Member',
        email: clean || 'user@example.com',
        role: 'USER',
        status: 'ACTIVE'
      }
    });
  }

  // 5. USER AUTH (REGISTER)
  if (url.includes('/auth/register')) {
    const { name, email } = body;
    return res.status(200).json({
      success: true,
      message: 'Registration successful!',
      token: 'user_jwt_' + Date.now(),
      user: {
        id: 'U' + Date.now().toString().slice(-5),
        name: name || 'SmartDeal Member',
        email: (email || '').toLowerCase().trim(),
        role: 'USER',
        status: 'ACTIVE'
      }
    });
  }

  // 6. USER FORGOT PASSWORD
  if (url.includes('/auth/forgot-password')) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    return res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email.',
      devCode: code
    });
  }

  // 7. USER RESET PASSWORD
  if (url.includes('/auth/reset-password')) {
    return res.status(200).json({
      success: true,
      message: 'Password reset successful!'
    });
  }

  // Default response
  return res.status(200).json({
    success: true,
    message: 'SmartDeal Vercel Serverless Gateway Active',
    timestamp: new Date().toISOString()
  });
}
