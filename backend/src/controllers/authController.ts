import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import knex from '../database/knex';
import { RegisterRequest, LoginRequest, AuthUser } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // USE ENVIRONMENT VARIABLE IN PRODUCTION!

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, roleName } = req.body as RegisterRequest;

    if (!username || !email || !password || !roleName) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    // Check if user already exists
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    // Map frontend roleName to backend role name
    let dbRoleName: string;
    switch (roleName) {
      case 'expedição':
        dbRoleName = 'expedition_responsible';
        break;
      case 'qualidade':
        dbRoleName = 'quality_control';
        break;
      case 'suprimentos':
        dbRoleName = 'viewer'; // Assuming 'suprimentos' maps to 'viewer' role
        break;
      case 'admin':
        dbRoleName = 'admin';
        break;
      default:
        return res.status(400).json({ message: 'Cargo inválido.' });
    }

    // Get role_id from roles table
    const role = await knex('roles').where({ name: dbRoleName }).first();
    if (!role) {
      return res.status(400).json({ message: `Cargo '${dbRoleName}' não encontrado.` });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [newUser] = await knex('users').insert({
      id: uuidv4(),
      username,
      email,
      password_hash,
      role_id: role.id,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning(['id', 'username', 'email', 'role_id']);

    if (!newUser) {
      return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }

    const userRole = await knex('roles').where({ id: newUser.role_id }).first();

    const authUser: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: userRole ? userRole.name : '',
    };

    const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ user: authUser, token });

  } catch (error) {
    console.error('Erro no registro de usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    const user = await knex('users').where({ email }).first();

    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou senha inválidos.' });
    }

    const userRole = await knex('roles').where({ id: user.role_id }).first();

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: userRole ? userRole.name : '',
    };

    const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ user: authUser, token });

  } catch (error) {
    console.error('Erro no login de usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}; 