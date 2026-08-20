import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { dishes, featuredDishIds } from '../../src/data/menu.js';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@lumiere-restaurant.ru';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-now';

const CATEGORIES = [
  { id: 'starters', nameRu: 'Закуски', nameEn: 'Starters', sortOrder: 1 },
  { id: 'soups', nameRu: 'Супы', nameEn: 'Soups', sortOrder: 2 },
  { id: 'mains', nameRu: 'Горячее', nameEn: 'Mains', sortOrder: 3 },
  { id: 'desserts', nameRu: 'Десерты', nameEn: 'Desserts', sortOrder: 4 },
  { id: 'drinks', nameRu: 'Напитки', nameEn: 'Drinks', sortOrder: 5 },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.category.deleteMany();
  await prisma.staff.deleteMany();

  for (const category of CATEGORIES) {
    await prisma.category.create({ data: category });
  }

  for (const [index, dish] of dishes.entries()) {
    await prisma.dish.create({
      data: {
        id: dish.id,
        categoryId: dish.category,
        nameRu: dish.name.ru,
        nameEn: dish.name.en,
        descriptionRu: dish.description.ru,
        descriptionEn: dish.description.en,
        price: dish.price,
        weight: dish.weight,
        image: dish.image,
        tags: dish.tags.join(','),
        allergens: dish.allergens.join(','),
        isFeatured: featuredDishIds.includes(dish.id),
        sortOrder: index,
      },
    });
  }

  await prisma.staff.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      name: 'Администратор',
      role: 'ADMIN',
    },
  });

  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      hoursText: 'Пн–Вс: 12:00–00:00',
      phone: '+7 (495) 000-12-34',
      email: 'hello@lumiere-restaurant.ru',
      address: 'Москва, ул. Тверская, 12',
      deliveryFee: 250,
      freeDeliveryThreshold: 3000,
      aboutRu: 'Lumière открылся в 2016 году как небольшой проект команды поваров, влюблённых в европейскую кухню.',
      aboutEn: 'Lumière opened in 2016 as a small project by a team of chefs in love with European cuisine.',
    },
  });

  console.log(`Seeded ${CATEGORIES.length} categories and ${dishes.length} dishes.`);
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}${process.env.ADMIN_PASSWORD ? '' : ' (dev default — change via ADMIN_PASSWORD env var)'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
