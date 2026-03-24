import { db } from '../db';
import { clients, tasks } from '../db/schema';

async function main() {
  console.log('Seeding database...');


  await db.delete(tasks);
  await db.delete(clients);


  const clientData = [
    { companyName: 'LedgersCFO Tech', country: 'India', entityType: 'Private Limited' },
    { companyName: 'Global Solutions Inc', country: 'USA', entityType: 'Corporation' },
    { companyName: 'Green Energy Ltd', country: 'UK', entityType: 'LLC' },
    { companyName: 'Cloud Nine Systems', country: 'India', entityType: 'Partnership' },
  ];

  const clientResults = await db.insert(clients).values(clientData).returning();


  const taskData = [];
  const categories = ['GST Filing', 'Income Tax', 'Audit', 'ROC Filing', 'Compliance Audit'];
  const statuses: ('Pending' | 'In Progress' | 'Completed')[] = ['Pending', 'In Progress', 'Completed'];
  const priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  for (const client of clientResults) {
    for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + (i % 2 === 0 ? -(i + 1) : (i + 1)));
        const dueDate = date.toISOString().split('T')[0];
        taskData.push({
            clientId: client.id,
            title: `${categories[i % categories.length]} - Q${(i % 4) + 1}`,
            description: `Quarterly ${categories[i % categories.length]} tracking for ${client.companyName}`,
            category: categories[i % categories.length],
            dueDate,
            status: i === 0 ? 'Pending' : statuses[i % statuses.length],
            priority: priorities[i % priorities.length],
        });
    }
  }

  await db.insert(tasks).values(taskData);

  console.log('Seeding complete!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
