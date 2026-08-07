if (process.env.NEW_VERCEL_DEPLOY !== 'true') {
  console.log('Se detectó el Vercel antiguo de Elías. Ignorando build.');
  process.exit(0); // Código 0 le indica a Vercel que NO debe compilar
} else {
  console.log('Se detectó el Vercel nuevo. Procediendo con el build.');
  process.exit(1); // Código 1 le indica a Vercel que SÍ debe compilar
}
