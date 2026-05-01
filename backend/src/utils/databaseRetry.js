function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withDatabaseRetry(operation, label) {
  const retries = Number(process.env.DB_CONNECT_RETRIES || 10);
  const delayMs = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 3000);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      console.warn(`${label} failed on attempt ${attempt}/${retries}. Retrying in ${delayMs}ms...`);
      await wait(delayMs);
    }
  }

  return undefined;
}

module.exports = withDatabaseRetry;
