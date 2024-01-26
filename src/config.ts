export const config = () => {
  console.log(process.env.MONGO_DEV_URI);
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    jwtSecret: process.env.JWT_SECRET,
    mongoUri:
      process.env.NODE_ENV === 'dev'
        ? process.env.MONGO_DEV_URI
        : process.env.MONGO_URI,
  };
};
