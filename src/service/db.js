import Dexie from 'dexie';

export const db = new Dexie('twDash');
// init db stuff and add indexes
db.version(1).stores({
  twEvents: '++id, convoId, agentId, language, timestamp, date, datetime', // Primary key and indexed props
  twCachedData: '++id, date, added'
});

// const id = await db.twEvents.add({
//     convoId: 'wei',
//     timestamp: '45',
//   });