// /** @type {import('next').NextConfig} */
import { NextConfig } from 'next';
import path from 'path';
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
