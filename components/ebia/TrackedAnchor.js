'use client';

import { forwardRef } from 'react';
import { trackInitiateCheckout, trackWhatsAppClick } from '@/lib/meta-pixel';

const trackers = {
  InitiateCheckout: trackInitiateCheckout,
  WhatsAppClick: trackWhatsAppClick,
};

const TrackedAnchor = forwardRef(function TrackedAnchor(
  { eventName, eventParams, children, onClick, ...props },
  ref
) {
  const handleClick = (event) => {
    const tracker = trackers[eventName];
    if (tracker) tracker(eventParams);
    if (onClick) onClick(event);
  };

  return (
    <a {...props} ref={ref} onClick={handleClick}>
      {children}
    </a>
  );
});

export default TrackedAnchor;
