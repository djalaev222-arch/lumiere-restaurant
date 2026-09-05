// Content for the one-page landing sections that don't come from the menu API:
// visit scenarios, special formats, events, FAQ, awards. Localised {ru, en}
// fields follow the same shape as src/data/menu.js and src/data/reviews.js.
// Photography reuses Unsplash IDs already verified elsewhere in the project.
const img = (id, w = 1100, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=72`;

// 3 — Сценарии визита
export const visitScenarios = [
  {
    id: 'breakfast',
    time: '09:00 – 12:00',
    title: { ru: 'Завтрак', en: 'Breakfast' },
    text: {
      ru: 'Тихое утро, фильтр-кофе и выпечка из своей пекарни.',
      en: 'A quiet morning, filter coffee and pastry from our own bakery.',
    },
    image: img('1509042239860-f550ce710b93', 900, 1100),
  },
  {
    id: 'lunch',
    time: '12:00 – 16:00',
    title: { ru: 'Обед', en: 'Lunch' },
    text: {
      ru: 'Сет из трёх блюд за 40 минут — для встреч в центре.',
      en: 'A three-course set in 40 minutes — for meetings downtown.',
    },
    image: img('1495147466023-ac5c588e2e94', 900, 1100),
  },
  {
    id: 'dinner',
    time: '18:00 – 00:00',
    title: { ru: 'Ужин', en: 'Dinner' },
    text: {
      ru: 'Свет свечей, дегустационное меню и пейринг от сомелье.',
      en: 'Candlelight, a tasting menu and a sommelier pairing.',
    },
    image: img('1432139509613-5c4255815697', 900, 1100),
  },
  {
    id: 'bar',
    time: '18:00 – 02:00',
    title: { ru: 'Бар', en: 'Bar' },
    text: {
      ru: 'Авторские коктейли и карта вин на 120 позиций у барной стойки.',
      en: 'Signature cocktails and a 120-label wine list at the bar.',
    },
    image: img('1514362545857-3bc16c4c7d1b', 900, 1100),
  },
];

// 4 — Концепция / шеф
export const conceptStats = [
  { id: 'years', value: 9, suffix: '', label: { ru: 'лет на Тверской', en: 'years on Tverskaya' } },
  { id: 'guests', value: 240, suffix: 'k', label: { ru: 'гостей за год', en: 'guests a year' } },
  { id: 'farms', value: 18, suffix: '', label: { ru: 'фермерских хозяйств', en: 'partner farms' } },
  { id: 'seats', value: 64, suffix: '', label: { ru: 'посадочных места', en: 'seats in the room' } },
];

export const conceptImage = img('1600565193348-f74bd3c7ccdf', 900, 1120);
export const conceptParallax = img('1550966871-3ed3cdb5ed0c', 1600, 1000);

// 6 — Пространство
export const spaceGallery = [
  { src: img('1517248135467-4c7edcad34c4', 1100, 1400), caption: { ru: 'Основной зал', en: 'Main hall' } },
  { src: img('1550966871-3ed3cdb5ed0c', 1100, 1400), caption: { ru: 'Зал у окна', en: 'Window room' } },
  { src: img('1554118811-1e0d58224f24', 1100, 1400), caption: { ru: 'Барная зона', en: 'Bar area' } },
  { src: img('1544148103-0773bf10d330', 1100, 1400), caption: { ru: 'Банкетный зал', en: 'Banquet room' } },
  { src: img('1470337458703-46ad1756a187', 1100, 1400), caption: { ru: 'Летняя веранда', en: 'Summer terrace' } },
  { src: img('1414235077428-338989a2e8c0', 1100, 1400), caption: { ru: 'Каминный зал', en: 'Fireside room' } },
];

// 7 — Особые форматы
export const specialFormats = [
  {
    id: 'chefs-table',
    title: { ru: 'Стол шефа', en: "Chef's table" },
    text: {
      ru: 'Шесть мест у открытой кухни, 12 подач и разговор с шефом весь вечер.',
      en: 'Six seats at the open kitchen, 12 courses and the chef with you all night.',
    },
    meta: { ru: 'до 6 гостей · 4 часа', en: 'up to 6 guests · 4 hours' },
    image: img('1476224203421-9ac39bcb3327', 1400, 1000),
  },
  {
    id: 'banquets',
    title: { ru: 'Банкеты и торжества', en: 'Banquets & celebrations' },
    text: {
      ru: 'Приватный зал на 20 гостей, отдельное меню и своя команда сервиса.',
      en: 'A private room for 20, a dedicated menu and your own service team.',
    },
    meta: { ru: 'до 20 гостей · зал целиком', en: 'up to 20 guests · whole room' },
    image: img('1544148103-0773bf10d330', 1400, 1000),
  },
  {
    id: 'gastro',
    title: { ru: 'Гастроужины', en: 'Guest-chef dinners' },
    text: {
      ru: 'Ужины в четыре руки с приглашёнными шефами — раз в месяц, по записи.',
      en: 'Four-hands dinners with guest chefs — once a month, by reservation.',
    },
    meta: { ru: 'раз в месяц · по записи', en: 'monthly · reservation only' },
    image: img('1600891964092-4316c288032e', 1400, 1000),
  },
];

// 8 — Признание
export const awards = [
  { id: 'wheretoeat', title: 'WhereToEat', note: { ru: '#7 в России, 2025', en: '#7 in Russia, 2025' } },
  { id: 'guide', title: 'Wine Spectator', note: { ru: 'Award of Excellence', en: 'Award of Excellence' } },
  { id: 'gq', title: 'GQ Russia', note: { ru: 'Ресторан года', en: 'Restaurant of the Year' } },
  { id: 'rating', title: '4.9 / 5', note: { ru: '1 240 отзывов · Яндекс Карты', en: '1,240 reviews · Yandex Maps' } },
];

// 9 — Новости и события
export const events = [
  {
    id: 'autumn-menu',
    date: '2026-09-15',
    title: { ru: 'Осеннее меню', en: 'Autumn menu' },
    text: {
      ru: 'Дичь, тыква, лесные грибы и новые десерты на облепихе.',
      en: 'Game, pumpkin, wild mushrooms and new sea-buckthorn desserts.',
    },
    image: img('1571877227200-a0d98ea607e9', 900, 640),
  },
  {
    id: 'wine-evening',
    date: '2026-09-27',
    title: { ru: 'Вечер вин Бургундии', en: 'Burgundy wine evening' },
    text: {
      ru: 'Пять хозяйств, шесть подач, сомелье Lumière весь вечер за столом.',
      en: 'Five estates, six courses, the Lumière sommelier at the table all night.',
    },
    image: img('1553361371-9b22f78e8b1d', 900, 640),
  },
  {
    id: 'guest-chef',
    date: '2026-10-11',
    title: { ru: 'Ужин с шефом из Лиона', en: 'Dinner with a chef from Lyon' },
    text: {
      ru: 'Гастроужин в четыре руки — классика Роны и наши сезонные продукты.',
      en: 'A four-hands dinner — Rhône classics meet our seasonal produce.',
    },
    image: img('1455619452474-d2be8b1e70cd', 900, 640),
  },
];

// 11 — FAQ
export const faq = [
  {
    id: 'address',
    q: { ru: 'Где вы находитесь и как добраться?', en: 'Where are you and how do I get there?' },
    a: {
      ru: 'Москва, ул. Тверская, 12, вход со стороны Камергерского переулка. 5 минут пешком от станций «Тверская» и «Театральная».',
      en: 'Tverskaya St. 12, Moscow, entrance from Kamergersky Lane. A 5-minute walk from Tverskaya and Teatralnaya metro stations.',
    },
  },
  {
    id: 'parking',
    q: { ru: 'Есть ли парковка?', en: 'Is there parking?' },
    a: {
      ru: 'Городская платная парковка вдоль Тверской и валет-сервис у входа с 18:00 (350 ₽).',
      en: 'Paid street parking along Tverskaya and valet service at the entrance from 18:00 (₽350).',
    },
  },
  {
    id: 'hours',
    q: { ru: 'Какие часы работы?', en: 'What are your opening hours?' },
    a: {
      ru: 'Ежедневно с 09:00 до 00:00, бар — до 02:00 по пятницам и субботам. Кухня принимает последний заказ в 23:15.',
      en: 'Daily 09:00–00:00, the bar until 02:00 on Fridays and Saturdays. The kitchen takes last orders at 23:15.',
    },
  },
  {
    id: 'group',
    q: { ru: 'Как забронировать стол для большой компании?', en: 'How do I book for a large group?' },
    a: {
      ru: 'Для брони от 8 гостей оставьте заявку в форме ниже или позвоните нам — предложим приватную зону и отдельное меню.',
      en: 'For 8 guests or more, use the form below or call us — we will arrange a private area and a set menu.',
    },
  },
  {
    id: 'kids',
    q: { ru: 'Можно ли прийти с детьми?', en: 'Can I come with children?' },
    a: {
      ru: 'Да, до 18:00 у нас детское меню, стульчики и уголок с книгами. Вечером зал рассчитан на взрослый формат.',
      en: 'Yes — until 18:00 we have a kids’ menu, high chairs and a reading corner. Evenings are an adults’ setting.',
    },
  },
  {
    id: 'diet',
    q: { ru: 'Учитываете ли вы аллергии и особенности питания?', en: 'Do you accommodate allergies and diets?' },
    a: {
      ru: 'Да. Укажите это в комментарии к брони — шеф адаптирует меню под вегетарианство, безглютеновую и другие диеты.',
      en: 'Yes. Note it in your booking comment — the chef adapts the menu for vegetarian, gluten-free and other diets.',
    },
  },
];

// 12 — форматы визита для формы брони
export const bookingFormats = ['dinner', 'lunch', 'breakfast', 'celebration', 'chefsTable', 'bar'];

export function formatEventDate(iso, lang) {
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long' });
}
