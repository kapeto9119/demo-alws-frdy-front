// Importamos la configuración de next-i18next
import i18nConfig from './next-i18next.config.js'; // Como tu archivo de configuración de next-i18next está en formato .js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig.i18n, // Aquí añadimos la configuración de i18n
};

export default nextConfig;
