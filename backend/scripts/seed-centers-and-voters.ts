import 'dotenv/config';
import mongoose from 'mongoose';
import { PollingCenterSchema } from '../src/common/schemas/polling-center.schema';
import { VoterSchema } from '../src/common/schemas/voter.schema';

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/senior-project';

function randArabicName(i: number) {
  const first = ['محمد','علي','حسن','حسين','محمود','رامي','جهاد','أحمد','يوسف','وائل','حسام','فؤاد','فضل','سامي','نبيل','طارق'];
  const last  = ['خليل','حمزة','عباس','طعمة','مراد','بو غانم','درويش','خوري','عبدالله','إبراهيم','زيدان','عطالله','حميّة','حمصي','مكي'];
  return `${first[i % first.length]} ${last[i % last.length]}`;
}

async function run() {
  await mongoose.connect(MONGO);

  const CenterModel = mongoose.model('PollingCenter', PollingCenterSchema);
  const VoterModel  = mongoose.model('Voter', VoterSchema);

  await CenterModel.deleteMany({});
  await VoterModel.deleteMany({});

  const centers = await CenterModel.insertMany([
    { name: 'Ramlieh Public School', districtId: 'Aley', address: 'Ramlieh - Main Road', stations: ['A','B','C'] },
    { name: 'Aley High School',      districtId: 'Aley', address: 'Aley - Downtown',     stations: ['A','B','C'] },
  ]);

  const bulk: any[] = [];
  for (const center of centers) {
    for (let i = 1; i <= 300; i++) {
      const st = center.stations[i % center.stations.length];
      bulk.push({
        insertOne: {
          document: {
            centerId: String(center._id),
            station: st,
            fullName: randArabicName(i),
            nationalId: `NID${100000 + i}${String(center._id).slice(-3)}`,
            checkedIn: false,
          },
        },
      });
    }
  }
  if (bulk.length) await VoterModel.bulkWrite(bulk);
  console.log('✔ Seeded centers & voters');
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
