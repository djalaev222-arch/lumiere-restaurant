import { sendEmail } from './email.js';
import { sendTelegramMessage } from './telegram.js';

const BOOKING_STATUS_TEXT = {
  CONFIRMED: 'подтверждена',
  DECLINED: 'отклонена',
  RESCHEDULED: 'перенесена — мы свяжемся с вами, чтобы согласовать новое время',
};

const ORDER_STATUS_TEXT = {
  PREPARING: 'готовится',
  ON_THE_WAY: 'в пути к вам',
  DELIVERED: 'доставлен — приятного аппетита!',
  CANCELLED: 'отменён',
};

function wrap(bodyHtml) {
  return `<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;background:#14110d;color:#f3ede4">
    <h1 style="font-style:italic;font-weight:500;margin:0 0 16px">Lumi&egrave;re</h1>
    ${bodyHtml}
  </div>`;
}

export async function notifyNewBooking(booking) {
  const tasks = [
    sendTelegramMessage(
      `🍽 <b>Новая бронь №${booking.id}</b>\n${booking.name}, ${booking.phone}\n${booking.date} в ${booking.time}, гостей: ${booking.guests}${booking.comment ? `\nКомментарий: ${booking.comment}` : ''}`
    ),
  ];

  if (booking.email) {
    tasks.push(
      sendEmail({
        to: booking.email,
        subject: `Заявка на бронь №${booking.id} получена`,
        html: wrap(
          `<p>Здравствуйте, ${booking.name}!</p>
           <p>Мы получили вашу заявку на стол ${booking.date} в ${booking.time} на ${booking.guests} гостей.</p>
           <p>Мы подтвердим бронь по телефону или e-mail в течение 15 минут.</p>`
        ),
      })
    );
  }

  await Promise.allSettled(tasks);
}

export async function notifyBookingStatusChange(booking) {
  if (!booking.email || !BOOKING_STATUS_TEXT[booking.status]) return;

  await sendEmail({
    to: booking.email,
    subject: `Ваша бронь №${booking.id} ${BOOKING_STATUS_TEXT[booking.status]}`,
    html: wrap(
      `<p>Здравствуйте, ${booking.name}!</p>
       <p>Ваша бронь на ${booking.date} в ${booking.time} ${BOOKING_STATUS_TEXT[booking.status]}.</p>`
    ),
  });
}

export async function notifyNewOrder(order) {
  const itemsText = order.items.map((item) => `${item.qty}× ${item.name}`).join(', ');

  const tasks = [
    sendTelegramMessage(
      `🛵 <b>Новый заказ №${order.id}</b>\n${order.name}, ${order.phone}\n${itemsText}\nИтого: ${order.total} ₽${order.address ? `\nАдрес: ${order.address}` : ' (самовывоз)'}`
    ),
  ];

  if (order.email) {
    tasks.push(
      sendEmail({
        to: order.email,
        subject: `Заказ №${order.id} принят`,
        html: wrap(
          `<p>Здравствуйте, ${order.name}!</p>
           <p>Ваш заказ №${order.id} на сумму ${order.total} ₽ принят в обработку.</p>
           <p>${itemsText}</p>
           <p>Мы пришлём уведомление, когда статус заказа изменится.</p>`
        ),
      })
    );
  }

  await Promise.allSettled(tasks);
}

export async function notifyOrderStatusChange(order) {
  if (!order.email || !ORDER_STATUS_TEXT[order.status]) return;

  await sendEmail({
    to: order.email,
    subject: `Заказ №${order.id}: ${ORDER_STATUS_TEXT[order.status]}`,
    html: wrap(
      `<p>Здравствуйте, ${order.name}!</p>
       <p>Ваш заказ №${order.id} ${ORDER_STATUS_TEXT[order.status]}.</p>`
    ),
  });
}
