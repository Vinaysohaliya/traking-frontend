import { OrderTrackingPage } from '@/components/OrderTrackingPage';

export default function OrderPage({ params }: { params: { id: string } }) {
  return <OrderTrackingPage orderId={params.id} />;
}
