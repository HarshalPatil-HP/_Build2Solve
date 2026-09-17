require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../src/config');
const { User, Company } = require('../src/models');

const SALT_ROUNDS = 10;

const seedDemo = async () => {
  await mongoose.connect(config.mongodbUri, { dbName: 'lm_compliance' });

  // 1. Seed Demo Company
  const company = await Company.findOneAndUpdate(
    { name: 'Shiv Shakti Agro Foods Pvt Ltd' },
    {
      $set: {
        name: 'Shiv Shakti Agro Foods Pvt Ltd',
        registrationNumber: 'REG/LMPC/GJ/2024/0921',
        address: 'Plot 45, GIDC Naroda, Ahmedabad, Gujarat',
        riskScore: 3.5,
      },
    },
    { upsert: true, new: true }
  );

  const passHashAdmin = await bcrypt.hash('Admin@123456', SALT_ROUNDS);
  const passHashInspector = await bcrypt.hash('Inspector@123456', SALT_ROUNDS);
  const passHashCompany = await bcrypt.hash('Company@123456', SALT_ROUNDS);
  const passHashUser = await bcrypt.hash('User@123456', SALT_ROUNDS);

  // 2. Seed Admin
  await User.findOneAndUpdate(
    { email: 'admin@doca.gov.in' },
    {
      $set: {
        name: 'System Controller Admin',
        email: 'admin@doca.gov.in',
        passwordHash: passHashAdmin,
        role: 'admin',
      },
    },
    { upsert: true }
  );

  // 3. Seed Inspector
  await User.findOneAndUpdate(
    { email: 'inspector@doca.gov.in' },
    {
      $set: {
        name: 'Inspector Vikram Singh',
        email: 'inspector@doca.gov.in',
        passwordHash: passHashInspector,
        role: 'inspector',
      },
    },
    { upsert: true }
  );

  // 4. Seed Company User
  await User.findOneAndUpdate(
    { email: 'quality@shivshaktiagro.com' },
    {
      $set: {
        name: 'Shiv Shakti Quality Manager',
        email: 'quality@shivshaktiagro.com',
        passwordHash: passHashCompany,
        role: 'company',
        companyId: company._id,
      },
    },
    { upsert: true }
  );

  // 5. Seed Consumer User
  await User.findOneAndUpdate(
    { email: 'consumer@domain.com' },
    {
      $set: {
        name: 'Harshal Patil (Consumer)',
        email: 'consumer@domain.com',
        passwordHash: passHashUser,
        role: 'user',
      },
    },
    { upsert: true }
  );

  console.log('\n✅ Demo Accounts Seeded Successfully:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin:     admin@doca.gov.in            | Admin@123456');
  console.log('🛡️ Inspector: inspector@doca.gov.in        | Inspector@123456');
  console.log('🏢 Company:   quality@shivshaktiagro.com   | Company@123456 (Company ID: ' + company._id + ')');
  console.log('👤 Consumer:  consumer@domain.com          | User@123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
};

seedDemo().catch((e) => {
  console.error(e);
  process.exit(1);
});
