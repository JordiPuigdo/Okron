import { useEffect, useRef } from 'react';

type UseScrollToElementOptions = {
  id: string | null;
  isLoading?: boolean;
  scrollOptions?: ScrollIntoViewOptions;
  prefixId?: string;
  shouldScroll?: boolean;
};

export function useScrollToElement({
  id,
  isLoading = false,
  scrollOptions = { behavior: 'smooth', block: 'center' },
  prefixId = '',
  shouldScroll = true,
}: UseScrollToElementOptions) {
  useEffect(() => {
    if (!id || isLoading || !shouldScroll) return;

    const elementId = `${prefixId}${id}`;
    const el = document.getElementById(elementId);

    if (el) {
      el.scrollIntoView(scrollOptions);
    }
  }, [id, isLoading, scrollOptions, prefixId, shouldScroll]);
}
