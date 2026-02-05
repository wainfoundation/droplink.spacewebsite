// Test script to verify Droplink workflow components
console.log('🧪 Testing Droplink Workflow Components...\n');

// Test 1: Validation Key Accessibility (Local Development)
async function testValidationKeyLocal() {
  try {
    const response = await fetch('http://localhost:2222/validation-key.txt');
    const content = await response.text();
    const expectedKey = '7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a';
    
    if (content.trim() === expectedKey) {
      console.log('✅ Validation key is accessible on localhost:2222');
      return true;
    } else {
      console.log('❌ Validation key content mismatch on localhost:2222');
      return false;
    }
  } catch (error) {
    console.log('❌ Validation key not accessible on localhost:2222:', error.message);
    return false;
  }
}

// Test 2: Production Domains Validation Key
async function testProductionDomains() {
  const domains = [
    'https://droplink.space/validation-key.txt',
    'https://www.droplink.space/validation-key.txt',
    'https://droplink-seven.vercel.app/validation-key.txt'
  ];
  
  const expectedKey = '7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a';
  
  console.log('🌐 Testing production domains...');
  
  for (const domain of domains) {
    try {
      const response = await fetch(domain);
      if (response.ok) {
        const content = await response.text();
        if (content.trim() === expectedKey) {
          console.log(`✅ ${domain} - Validation key accessible and correct`);
        } else {
          console.log(`⚠️  ${domain} - Validation key accessible but content mismatch`);
        }
      } else {
        console.log(`❌ ${domain} - Not accessible (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${domain} - Error: ${error.message}`);
    }
  }
}

// Test 3: Main Application Accessibility
async function testMainApp() {
  try {
    const response = await fetch('http://localhost:2222/');
    if (response.ok) {
      console.log('✅ Main application is accessible on localhost:2222');
      return true;
    } else {
      console.log('❌ Main application not accessible on localhost:2222');
      return false;
    }
  } catch (error) {
    console.log('❌ Main application error:', error.message);
    return false;
  }
}

// Test 4: Signup Page Accessibility
async function testSignupPage() {
  try {
    const response = await fetch('http://localhost:2222/signup');
    if (response.ok) {
      console.log('✅ Signup page is accessible on localhost:2222');
      return true;
    } else {
      console.log('❌ Signup page not accessible on localhost:2222');
      return false;
    }
  } catch (error) {
    console.log('❌ Signup page error:', error.message);
    return false;
  }
}

// Test 5: Domain Verification Page
async function testDomainVerification() {
  try {
    const response = await fetch('http://localhost:2222/domain-verification');
    if (response.ok) {
      console.log('✅ Domain verification page is accessible on localhost:2222');
      return true;
    } else {
      console.log('❌ Domain verification page not accessible on localhost:2222');
      return false;
    }
  } catch (error) {
    console.log('❌ Domain verification page error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting workflow tests...\n');
  
  const localTests = [
    { name: 'Validation Key (Local)', fn: testValidationKeyLocal },
    { name: 'Main App', fn: testMainApp },
    { name: 'Signup Page', fn: testSignupPage },
    { name: 'Domain Verification', fn: testDomainVerification }
  ];
  
  let passed = 0;
  let total = localTests.length;
  
  // Run local tests
  for (const test of localTests) {
    const result = await test.fn();
    if (result) passed++;
  }
  
  console.log(`\n📊 Local Test Results: ${passed}/${total} tests passed`);
  
  // Test production domains
  await testProductionDomains();
  
  if (passed === total) {
    console.log('\n🎉 All local tests passed! Your Droplink workflow is ready!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open http://localhost:2222/signup in your browser');
    console.log('2. Complete the signup process');
    console.log('3. Test domain verification at http://localhost:2222/domain-verification');
    console.log('4. Explore the dashboard and features');
    console.log('\n🌐 Production Domains:');
    console.log('- droplink.space');
    console.log('- www.droplink.space');
    console.log('- droplink-seven.vercel.app');
    console.log('\n⚠️  Make sure validation-key.txt is uploaded to all production domains!');
  } else {
    console.log('\n⚠️  Some local tests failed. Please check the issues above.');
  }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runAllTests();
} else {
  // Browser environment
  runAllTests();
} 