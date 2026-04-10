if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const email = process.argv[2];
const password = process.argv[3];

const generatePhoneNumber = () => {
  const suffix = Date.now().toString().slice(-9);
  return `9${suffix}`;
};

const generateNameFromEmail = value => value.split('@')[0] || 'admin';

const printUsage = () => {
  console.log('Usage: npm run make-admin -- <email> <password>');
  console.log('Example: npm run make-admin -- sanjana@gmail.com Sanjana@123');
};

const main = async () => {
  let closeDB = async () => {};

  if (!email || !password) {
    console.error('❌ Email and password are required.');
    printUsage();
    process.exit(1);
  }

  try {
    const databaseModule = await import('../src/config/database.js');
    const { connectDB } = databaseModule;
    closeDB = databaseModule.closeDB;
    const { User } = await import('../src/models/UserSchema.js');

    await connectDB();

    const user = await User.findOne({ email }).select('+password');

    if (user) {
      user.isAdmin = true;
      user.password = password;
      await user.save();

      console.log('✅ Existing user promoted to admin successfully');
      console.log(`📧 Email: ${user.email}`);
      console.log(`👑 isAdmin: ${user.isAdmin}`);
      return;
    }

    const createdUser = await User.create({
      name: generateNameFromEmail(email),
      email,
      phoneNumber: generatePhoneNumber(),
      password,
      isAdmin: true
    });

    console.log('✅ New admin user created successfully');
    console.log(`📧 Email: ${createdUser.email}`);
    console.log(`👤 Name: ${createdUser.name}`);
    console.log(`📱 Phone: ${createdUser.phoneNumber}`);
    console.log(`👑 isAdmin: ${createdUser.isAdmin}`);
  } catch (error) {
    console.error('❌ Failed to update admin user:', error.message);
    process.exit(1);
  } finally {
    try {
      await closeDB();
    } catch (closeError) {
      // ignore close errors for CLI script
    }
  }
};

main();
