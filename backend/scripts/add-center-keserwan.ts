// scripts/add-center-keserwan.ts
import 'dotenv/config';
import mongoose from 'mongoose';

import { PollingCenterSchema } from '../src/common/schemas/polling-center.schema';
import { VoterSchema } from '../src/common/schemas/voter.schema';
import { CandidateSchema } from '../src/candidates/schemas/candidate.schema';

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/senior-project';

function randName(i: number) {
  const first = ['نعيم','جورج','رامي','بسام','شربل','رواد','مازن','جهاد','جاد','فراس','طارق','فادي','رائد','حسن','إيلي'];
  const last  = ['قزي','حداد','رحمة','حبيب','الخوري','مرادي','بو حبيب','ضو','بو خليل','الخازن','فرماوي','فتال','كرم','عون','فرنجية'];
  return `${first[i % first.length]} ${last[i % last.length]}`;
}

async function run() {
  await mongoose.connect(MONGO);

  const Center = mongoose.model('PollingCenter', PollingCenterSchema);
  const Voter  = mongoose.model('Voter', VoterSchema);
  const Cand   = mongoose.model('Candidate', CandidateSchema);

  // 1) Ensure a Keserwan center
  const centerName   = 'Keserwan College';
  const districtKey  = 'كسروان';               // <-- IMPORTANT: must match Candidate.area filter
  const stations     = ['A', 'B'];

  let center = await Center.findOne({ name: centerName });
  if (!center) {
    center = await Center.create({
      name: centerName,
      districtId: districtKey,                 // if your schema uses "district", change this key
      address: 'Jounieh - Main Road',
      stations,
    });
    console.log('✔ created center:', centerName);
  } else {
    console.log('ℹ using existing center:', centerName);
  }

  const centerId = center._id;

  // 2) Seed ~60 voters for this center if missing
  const haveVoters = await Voter.countDocuments({ centerId });
  if (haveVoters < 20) {
    const voters = Array.from({ length: 60 }).map((_, i) => ({
      centerId,
      station: stations[i % stations.length],
      fullName: randName(i + 1),
      nationalId: `KES${100000 + (i + 1)}`,
      checkedIn: false,
    }));
    await Voter.insertMany(voters, { ordered: false });
    console.log(`✔ inserted ${voters.length} voters for ${centerName}`);
  } else {
    console.log(`ℹ voters already present for ${centerName}: ${haveVoters}`);
  }

  // 3) Ensure two Keserwan candidates (area = "كسروان")
  const upserts = [
    {
      name: 'نعمة افرام',
      summary: 'مرشح عن منطقة كسروان.',
      area: 'كسروان',
      district: 'كسروان',
      party: 'مستقل',
    },
    {
      name: 'شامل روكز',
      summary: 'مرشح عن منطقة كسروان.',
      area: 'كسروان',
      district: 'كسروان',
      party: 'مستقل',
    },
  ];

  for (const c of upserts) {
    await Cand.updateOne(
      { name: c.name, $or: [{ area: c.area }, { district: c.district }] },
      { $setOnInsert: c },
      { upsert: true }
    );
    console.log('✔ ensured candidate:', c.name);
  }

  await mongoose.disconnect();
  console.log('✅ done');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
