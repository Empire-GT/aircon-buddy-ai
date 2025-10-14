// Script to create test users for Aircon Buddy AI
// Run this with: node create_test_users.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testUsers = [
  {
    email: 'admin@coolairpro.com',
    password: 'password123',
    fullName: 'Admin User',
    phone: '+63 123 456 7890',
    role: 'admin'
  },
  {
    email: 'juan@coolairpro.com',
    password: 'password123',
    fullName: 'Juan Dela Cruz',
    phone: '+63 912 345 6789',
    role: 'technician'
  },
  {
    email: 'maria@coolairpro.com',
    password: 'password123',
    fullName: 'Maria Santos',
    phone: '+63 917 123 4567',
    role: 'technician'
  },
  {
    email: 'pedro@coolairpro.com',
    password: 'password123',
    fullName: 'Pedro Rodriguez',
    phone: '+63 918 987 6543',
    role: 'technician'
  },
  {
    email: 'client@test.com',
    password: 'password123',
    fullName: 'Test Client',
    phone: '+63 999 888 7777',
    role: 'client'
  }
];

async function createUsers() {
  console.log('🚀 Starting user creation process...\n');

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          full_name: user.fullName,
          phone: user.phone
        }
      });

      if (authError) {
        console.error(`❌ Error creating user ${user.email}:`, authError.message);
        continue;
      }

      console.log(`✅ User ${user.email} created successfully`);

      // Update role if not client (client is default)
      if (user.role !== 'client') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: user.role })
          .eq('user_id', authData.user.id);

        if (roleError) {
          console.error(`❌ Error updating role for ${user.email}:`, roleError.message);
        } else {
          console.log(`✅ Role updated to ${user.role} for ${user.email}`);
        }
      }

      // Add technician details if role is technician
      if (user.role === 'technician') {
        const technicianData = getTechnicianData(user.email);
        const { error: techError } = await supabase
          .from('technicians')
          .insert({
            id: authData.user.id,
            ...technicianData
          });

        if (techError) {
          console.error(`❌ Error adding technician details for ${user.email}:`, techError.message);
        } else {
          console.log(`✅ Technician details added for ${user.email}`);
        }
      }

      console.log(''); // Empty line for readability

    } catch (error) {
      console.error(`❌ Unexpected error creating user ${user.email}:`, error.message);
    }
  }

  console.log('🎉 User creation process completed!');
  console.log('\n📋 Summary of created users:');
  testUsers.forEach(user => {
    console.log(`- ${user.email} (${user.role}) - password: ${user.password}`);
  });
}

function getTechnicianData(email) {
  const technicianProfiles = {
    'juan@coolairpro.com': {
      skills: ['Window Type Installation', 'Split Type Installation', 'Basic Repair', 'General Cleaning'],
      service_area: ['Quezon City', 'Manila', 'Caloocan'],
      availability_status: 'available',
      current_latitude: 14.6760,
      current_longitude: 121.0437,
      rating: 4.8,
      total_jobs: 45,
      completed_jobs: 42,
      earnings: 125000.00,
      is_verified: true,
      is_active: true
    },
    'maria@coolairpro.com': {
      skills: ['Cassette Type Installation', 'Advanced Repair', 'Dismantle', 'Inspection'],
      service_area: ['Makati', 'BGC', 'Ortigas', 'Mandaluyong'],
      availability_status: 'available',
      current_latitude: 14.5547,
      current_longitude: 121.0244,
      rating: 4.9,
      total_jobs: 38,
      completed_jobs: 35,
      earnings: 142000.00,
      is_verified: true,
      is_active: true
    },
    'pedro@coolairpro.com': {
      skills: ['Window Type Installation', 'Split Type Installation', 'Basic Repair', 'General Cleaning', 'Dismantle'],
      service_area: ['Taguig', 'Pasig', 'Marikina', 'San Juan'],
      availability_status: 'available',
      current_latitude: 14.5176,
      current_longitude: 121.0509,
      rating: 4.7,
      total_jobs: 52,
      completed_jobs: 48,
      earnings: 156000.00,
      is_verified: true,
      is_active: true
    }
  };

  return technicianProfiles[email] || {};
}

// Run the script
createUsers().catch(console.error);
