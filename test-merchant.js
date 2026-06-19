const axios = require('axios');

async function run() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:3001/api/v1/auth/admin/login', {
      email: 'admin2@citylink.com',
      password: 'password123'
    });
    const token = loginRes.data.data.token;
    console.log('Login success, got token');

    // 2. Try to create merchant
    const payload = {
        name: "Test Merchant From Script",
        categoryId: null,
        description: null,
        logoUrl: null,
        coverImageUrl: null,
        contactName: null,
        contactPhone: null,
        addressLine: null,
        city: "Bangkok",
        township: null,
        landmark: null,
        buildingName: null,
        serviceMode: 'DELIVERY',
        minimumOrderAmount: 0,
        deliveryRadiusKm: null,
        operatingStatus: 'OPEN',
        isFeatconst axios = require('axios');

async function run() {
  try {
    // 1. Login to :', JSON.stringify(payload, null, 2));
  try {
    // 1. Log=     //ax    const loginRes = await ost:3001/api/v1/merchants', payload, {
      headers: {
        Authorization: `Bearer ${token}      password: 'password123'
    cc    });
    const token = loginRes.ch (error)     console.log('Login success, got to,