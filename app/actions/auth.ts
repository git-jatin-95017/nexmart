'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function signUpAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'BUYER' | 'SELLER' | 'BOTH'

  if (!name || !email || !password || !role) {
    return { error: 'All fields are required' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'User with this email already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    if (role === 'SELLER' || role === 'BOTH') {
      await prisma.seller.create({
        data: {
          name,
          email,
          description: `${name}'s store`,
          userId: user.id,
        },
      })
    }

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    })
  } catch (error) {
    return { error: 'Failed to create user' }
  }
}

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password' }
    }
    throw error
  }
}
