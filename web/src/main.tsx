import React from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { ItemNotificationsProvider } from './components/utils/ItemNotifications';
//import './index.scss';
import { store } from './store';
import './styles/main.css';
import { isEnvBrowser } from './utils/misc';

const root = document.getElementById('root');

if (isEnvBrowser()) {
  const isNight = false;
  root!.style.backgroundImage = `url(${
    isNight ? 'https://i.imgur.com/iPTAdYV.png' : 'https://i.imgur.com/3pzRj9n.png'
  })`;
  root!.style.backgroundSize = 'cover';
  root!.style.backgroundRepeat = 'no-repeat';
  root!.style.backgroundPosition = 'center';
}

createRoot(root!).render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <ItemNotificationsProvider>
          <App />
        </ItemNotificationsProvider>
      </DndProvider>
    </Provider>
  </React.StrictMode>
);
