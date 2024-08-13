import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedTodoLists();
    // await seedUsers();
    // await seedCustomers();
    // await seedInvoices();
    // await seedRevenue();
    await client.sql`COMMIT`;
  
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

export async function POST() {
  try {
    
  } catch (error) {

  }
}

export async function PUT() {
  
}

export async function DELETE() {
  
}