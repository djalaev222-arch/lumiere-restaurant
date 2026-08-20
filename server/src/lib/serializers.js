function splitList(value) {
  return value ? value.split(',').filter(Boolean) : [];
}

export function serializeDish(dish) {
  return {
    id: dish.id,
    category: dish.categoryId,
    name: { ru: dish.nameRu, en: dish.nameEn },
    description: { ru: dish.descriptionRu, en: dish.descriptionEn },
    price: dish.price,
    weight: dish.weight,
    image: dish.image,
    tags: splitList(dish.tags),
    allergens: splitList(dish.allergens),
    isAvailable: dish.isAvailable,
    isFeatured: dish.isFeatured,
  };
}

export function serializeCategory(category) {
  return {
    id: category.id,
    name: { ru: category.nameRu, en: category.nameEn },
    sortOrder: category.sortOrder,
  };
}

export function serializeBooking(booking) {
  return {
    id: booking.id,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    date: booking.date,
    time: booking.time,
    guests: booking.guests,
    comment: booking.comment,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

export function serializeOrder(order) {
  return {
    id: order.id,
    name: order.name,
    phone: order.phone,
    email: order.email,
    method: order.method,
    address: order.address,
    timeType: order.timeType,
    payment: order.payment,
    comment: order.comment,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    items: (order.items ?? []).map((item) => ({
      dishId: item.dishId,
      name: item.name,
      price: item.price,
      qty: item.qty,
    })),
  };
}
