const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.registerUser = async (name, email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password with 12 salt rounds for stronger security
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return { id: user.id, name: user.name, email: user.email };
};

exports.loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT payload without sensitive data like password hash
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret_for_development',
    { expiresIn: '24h' }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};
