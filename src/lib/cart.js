export function getCartLines(items, dishes) {
  return items
    .map((item) => {
      const dish = dishes.find((d) => d.id === item.id);
      return dish ? { dish, qty: item.qty } : null;
    })
    .filter(Boolean);
}

export function getCartSubtotal(lines) {
  return lines.reduce((sum, line) => sum + line.dish.price * line.qty, 0);
}

export function getCartItemCount(items) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}
