'use client';

import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

import App from './App'
import { defaultCipherList } from 'constants'

export const metadata = {};

export default function Layout({
  children,
} : {children:React.ReactNode})
{
  return<App>{children}</App>
}
