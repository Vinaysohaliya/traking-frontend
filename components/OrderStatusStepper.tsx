'use client';

import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEPS,
} from '@/types';

interface OrderStatusStepperProps {
  status: OrderStatus;
}

const STATUS_ICONS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: '📋',
  PREPARING: '👨‍🍳',
  OUT_FOR_DELIVERY: '🛵',
  DELIVERED: '✅',
};

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  const currentIndex = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <div className="w-full" data-testid="order-status-stepper">
      <div className="flex items-start justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-orange-500 z-0 transition-all duration-700"
          style={{
            width: `${(currentIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
          }}
        />

        {ORDER_STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step}
              className="flex flex-col items-center z-10 flex-1"
              data-testid={`step-${step}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-orange-500 border-orange-500'
                    : isCurrent
                    ? 'bg-white border-orange-500 animate-pulse shadow-md shadow-orange-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                {STATUS_ICONS[step]}
              </div>
              <span
                className={`mt-2 text-xs text-center font-medium leading-tight max-w-[70px] ${
                  isCurrent
                    ? 'text-orange-600'
                    : isCompleted
                    ? 'text-orange-400'
                    : 'text-gray-400'
                }`}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
