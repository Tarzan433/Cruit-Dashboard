import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ChatPage from './pages/ChatPage';
import './index.css';

function DebugChat() {
  useEffect(() => {
    const logLayout = () => {
      const list = document.querySelector('.chat-left');
      const right = document.querySelector('.chat-right');
      const root = document.getElementById('root');

      const describe = (el: Element | null) => {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: (el as HTMLElement).className,
          display: cs.display,
          width: rect.width,
          height: rect.height,
          flexBasis: cs.flexBasis,
          flexGrow: cs.flexGrow,
          flexShrink: cs.flexShrink,
          minWidth: cs.minWidth,
          position: cs.position,
        };
      };

      const chain: Array<any> = [];
      let current: Element | null = right;
      while (current && current !== document.body) {
        chain.push(describe(current));
        current = current.parentElement;
      }
      chain.push(describe(document.body));

      console.log('Chat debug | list', describe(list));
      console.log('Chat debug | right', describe(right));
      console.log('Chat debug | ancestor chain', chain);
    };

    const timer = window.setTimeout(logLayout, 500);
    window.addEventListener('resize', logLayout);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', logLayout);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <ChatPage onBack={() => undefined} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DebugChat />
  </StrictMode>
);
