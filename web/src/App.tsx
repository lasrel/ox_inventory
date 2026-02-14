import { useDragDropManager } from 'react-dnd';
import InventoryComponent from './components/inventory';
import DragPreview from './components/utils/DragPreview';
import KeyPress from './components/utils/KeyPress';
import useNuiEvent from './hooks/useNuiEvent';
import { useAppDispatch } from './store';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { Inventory } from './typings';
import { debugData } from './utils/debugData';
import { fetchNui } from './utils/fetchNui';

interface DebugItem {
  slot: number;
  name: string;
  count: number;
  weight: number;
  metadata?: {
    [key: string]: any;
  };
  durability?: number;
  ammoname?: string;
}

debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 10,
        label: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 4,
            name: 'water',
            count: 1,
            weight: 500,
          },
          {
            slot: 5,
            name: 'water',
            count: 1,
            weight: 500,
          },
          {
            slot: 6,
            name: 'backwoods',
            weight: 100,
            count: 1,
            metadata: {
              label: 'Russian Cream',
              imageurl: 'https://i.imgur.com/2xHhTTz.png',
            },
          },
          {
            slot: 7,
            name: 'burger',
            count: 2,
            weight: 400,
            metadata: {
              description: 'test description',
            },
          },
          {
            slot: 8,
            name: 'WEAPON_RAILGUN',
            weight: 3570,
            count: 1,
          },
        ] satisfies DebugItem[],
      },
      rightInventory: {
        id: 'shop',
        type: 'stash',
        slots: 10,
        label: 'Shop',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'lockpick',
            label: 'Lockpick',
            weight: 160,
            ingredients: {
              scrapmetal: 5,
              WEAPON_HAMMER: 0.05,
            },
            duration: 5000,
            count: 2,
          },
        ],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
  }>('init', ({ locale, items, leftInventory, imagepath }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];

    setImagePath(imagepath);
    dispatch(setupInventory({ leftInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <div className="app-wrapper">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
