const axios = require('axios');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:3001/api/v1/auth/admin/login', {
      email: 'admin2@citylink.com',
      password: 'password123'
    });
    const token = loginRes.data.data.token;
    
    const payload = {
        name: "Test Merchant",
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
        isFeatured: false,
        status: 'ACTIVE',
    };

    const createRes = await axios.post('http://localhost:3001/api/v1/merchants', payload, {
const axios = require('axios');

async function run


async function run() {
  try {
    coeat  try {
    const log (    c) {      email: 'admin2@citylink.com',
      password: 'password123'
    });
    c

run();
