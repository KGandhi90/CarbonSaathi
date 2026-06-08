/**
 * @fileoverview Mock data for CarbonSaathi development.
 * All values in kg CO₂ unless specified.
 * @module data/mockData
 */

/** @type {{ name: string, city: string, avgDaily: number, mainSource: string, score: number }} */
export const userProfile = {
  name:        'Rohan',
  city:        'Mumbai',
  avgDaily:    2.4,
  mainSource:  'Transport',
  score:       42,
};

/**
 * Today's carbon breakdown by category.
 * @type {Array<{ id: string, label: string, value: number, unit: string, percent: number, trend: string, color: string, icon: string }>}
 */
export const todayBreakdown = [
  {
    id:       'transport',
    label:    'Transport',
    value:    0.8,
    unit:     'kg CO₂',
    percent:  33,
    trend:    'up',
    color:    'amber',
    icon:     'Car',
  },
  {
    id:       'food',
    label:    'Food',
    value:    0.6,
    unit:     'kg CO₂',
    percent:  25,
    trend:    'down',
    color:    'secondary',
    icon:     'Leaf',
  },
  {
    id:       'energy',
    label:    'Energy',
    value:    0.7,
    unit:     'kg CO₂',
    percent:  29,
    trend:    'stable',
    color:    'sky',
    icon:     'Zap',
  },
  {
    id:       'shopping',
    label:    'Shopping',
    value:    0.3,
    unit:     'kg CO₂',
    percent:  13,
    trend:    'down',
    color:    'coral',
    icon:     'ShoppingBag',
  },
];

/**
 * Weekly emission data for bar chart.
 * @type {Array<{ day: string, value: number, isToday: boolean }>}
 */
export const weeklyData = [
  { day: 'Mon', value: 2.1, isToday: false },
  { day: 'Tue', value: 3.4, isToday: false },
  { day: 'Wed', value: 1.8, isToday: false },
  { day: 'Thu', value: 2.9, isToday: false },
  { day: 'Fri', value: 2.4, isToday: true  },
  { day: 'Sat', value: 3.8, isToday: false },
  { day: 'Sun', value: 1.6, isToday: false },
];

/**
 * Actionable tips with CO₂ savings estimates.
 * @type {Array<{ id: number, text: string, saving: number, color: string, border: string, done: boolean }>}
 */
export const tips = [
  {
    id:      1,
    text:    'Take the metro instead of cab today',
    saving:  0.4,
    color:   'secondary',
    border:  'border-l-secondary',
    done:    false,
  },
  {
    id:      2,
    text:    'Skip meat for one meal',
    saving:  0.3,
    color:   'amber',
    border:  'border-l-amber',
    done:    false,
  },
  {
    id:      3,
    text:    'Unplug devices when not in use',
    saving:  0.1,
    color:   'sky',
    border:  'border-l-sky',
    done:    false,
  },
];

/**
 * Transport mode options with emission factors (kg CO₂/km).
 * @type {Array<{ id: string, label: string, factor: number }>}
 */
export const transportModes = [
  { id: 'car',    label: 'Car',    factor: 0.21  },
  { id: 'bike',   label: 'Bike',   factor: 0.09  },
  { id: 'metro',  label: 'Metro',  factor: 0.04  },
  { id: 'auto',   label: 'Auto',   factor: 0.07  },
  { id: 'flight', label: 'Flight', factor: 0.255 },
  { id: 'walk',   label: 'Walk',   factor: 0.0   },
];

/**
 * Food type options with emission factors (kg CO₂/meal).
 * @type {Array<{ id: string, label: string, factor: number }>}
 */
export const foodTypes = [
  { id: 'veg',     label: 'Veg',     factor: 0.5 },
  { id: 'chicken', label: 'Chicken', factor: 1.5 },
  { id: 'mutton',  label: 'Mutton',  factor: 3.0 },
  { id: 'fish',    label: 'Fish',    factor: 0.9 },
  { id: 'eggs',    label: 'Eggs',    factor: 0.4 },
];

/**
 * Shopping category options with emission factors (kg CO₂/₹1000).
 * @type {Array<{ id: string, label: string, factor: number }>}
 */
export const shoppingTypes = [
  { id: 'clothing',     label: 'Clothing',    factor: 2.0 },
  { id: 'electronics',  label: 'Electronics', factor: 4.0 },
  { id: 'groceries',    label: 'Groceries',   factor: 0.5 },
  { id: 'none',         label: 'None',        factor: 0.0 },
];

/**
 * Seed messages for the AI chat interface.
 * @type {Array<{ id: number, role: string, content: string, timestamp: string }>}
 */
export const chatSeedMessages = [
  {
    id:        1,
    role:      'user',
    content:   'What\'s the biggest change I can make to reduce my carbon footprint?',
    timestamp: '10:24 AM',
  },
  {
    id:        2,
    role:      'assistant',
    content:   'For most urban Indians, transport is the biggest contributor — especially daily cab usage. Switching from Ola/Uber to metro can cut 60-80% of your transport emissions. 20km daily by cab = ~4.2 kg CO₂. Metro brings it to ~0.8 kg. That single change saves ~1,000 kg CO₂ per year. Want city-specific metro tips?',
    timestamp: '10:24 AM',
  },
];
