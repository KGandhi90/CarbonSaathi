/**
 * @fileoverview Helper utilities for CarbonSaathi.
 * Pure functions for formatting, greetings, and mock AI responses.
 * @module utils/helpers
 */

import { formatCO2 } from './carbonCalc';

/**
 * Formats a share message for activity log.
 * @param {number} total - Total CO₂ in kg
 * @returns {string} Shareable text string
 */
export function formatShareText(total) {
  return `I logged ${formatCO2(total)} kg CO₂ today using CarbonSaathi! 🌱 Track yours at ${window.location.origin}`;
}

/**
 * Returns greeting based on current hour.
 * @returns {string} Time-appropriate greeting with emoji
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning 🌱';
  if (hour < 17) return 'Good afternoon 🌿';
  return 'Good evening 🍃';
}

/**
 * Returns keyword-matched mock AI response for development without Gemini API.
 * @param {string} input - User message
 * @returns {string} Mock AI response text
 */
export function getMockReply(input) {
  const msg = input.toLowerCase();

  if (msg.includes('mumbai') || msg.includes('delhi') || msg.includes('bangalore') || msg.includes('city')) {
    return 'For most Indian metros, switching from daily cab rides to metro rail is the single highest-impact change. Mumbai\'s local train network is one of the most carbon-efficient transit systems in the world at ~0.04 kg CO₂/km. Even 2 days a week on metro saves ~200 kg CO₂ annually.';
  }

  if (msg.includes('ev') || msg.includes('electric vehicle') || msg.includes('electric car')) {
    return 'An EV in India is genuinely worth it if you charge from the grid — India\'s grid is ~40% renewable and improving. A Tata Nexon EV emits ~0.05 kg CO₂/km vs ~0.21 kg for a petrol car. Payback period on emissions is ~18 months of average urban driving.';
  }

  if (msg.includes('diet') || msg.includes('food') || msg.includes('veg') || msg.includes('meat')) {
    return 'Diet is India\'s second biggest household emission source. One mutton meal = ~3 kg CO₂ vs 0.5 kg for a veg meal. Going veg just 3 days a week saves ~200 kg CO₂/year — equivalent to planting 9 trees. Local, seasonal produce cuts emissions further by 30–50%.';
  }

  if (msg.includes('offset') || msg.includes('offsetting')) {
    return 'Carbon offsetting means funding projects that reduce CO₂ elsewhere — like Indian renewable energy farms or forest conservation. Good Indian platforms include GreenJams and SustainKart. But reducing first, then offsetting the remainder, is always better than offsetting alone.';
  }

  if (msg.includes('energy') || msg.includes('electricity') || msg.includes('home')) {
    return 'Home energy in Indian cities is mostly the grid (coal-heavy). Top wins: switch to LED (90% less energy), set AC to 24°C (saves 6% per degree), use 5-star BEE-rated appliances. Rooftop solar payback in India is now under 5 years in most states.';
  }

  if (msg.includes('zomato') || msg.includes('swiggy') || msg.includes('delivery') || msg.includes('cooking')) {
    return 'Home cooking beats food delivery on carbon by ~40-60%. Delivery adds packaging waste (~0.1 kg CO₂) and last-mile petrol bike emissions. Batch cooking 3-4 meals at once is the most carbon-efficient approach — uses the same energy as one meal.';
  }

  if (msg.includes('flight') || msg.includes('fly') || msg.includes('air travel')) {
    return 'Aviation is carbon-intensive — a Mumbai-Delhi flight emits ~0.15 kg CO₂/km per passenger, vs ~0.04 kg for AC train. Taking the Rajdhani instead of flying Mumbai-Delhi saves ~120 kg CO₂ per trip. For unavoidable flights, economy class has ~3x lower footprint than business class.';
  }

  if (msg.includes('india') || msg.includes('target') || msg.includes('net zero')) {
    return 'India pledged Net Zero by 2070 at COP26, with 50% energy from renewables by 2030. India is on track — renewables hit 44% of installed capacity in 2024. Per capita, India emits ~2.0 tonnes CO₂/year vs global avg of 4.7 tonnes. But urban Indians average 3–5x the national figure.';
  }

  return 'Great question about sustainability! I can help with transport choices, diet impact, home energy, carbon offsetting, and India-specific climate data. What would you like to explore?';
}
