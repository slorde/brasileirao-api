import postgres from 'postgres'

const sql = postgres(process.env.DB_PATH || '',{});

export default sql