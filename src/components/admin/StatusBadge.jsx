const TONE_BY_STATUS = {
  NEW: 'new',
  CONFIRMED: 'positive',
  DELIVERED: 'positive',
  DECLINED: 'negative',
  CANCELLED: 'negative',
  RESCHEDULED: 'neutral',
  PREPARING: 'neutral',
  ON_THE_WAY: 'neutral',
  PENDING: 'new',
  SUCCEEDED: 'positive',
  CANCELED: 'negative',
};

const LABELS = {
  NEW: 'Новая',
  CONFIRMED: 'Подтверждена',
  DECLINED: 'Отклонена',
  RESCHEDULED: 'Перенесена',
  PREPARING: 'Готовится',
  ON_THE_WAY: 'В пути',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
  PENDING: 'Ожидает оплаты',
  SUCCEEDED: 'Оплачен',
  CANCELED: 'Оплата отменена',
};

export default function StatusBadge({ status }) {
  const tone = TONE_BY_STATUS[status] || 'neutral';
  return <span className={`status-badge status-badge--${tone}`}>{LABELS[status] || status}</span>;
}
