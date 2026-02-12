import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { onGive } from '../../dnd/onGive';
import { onUse } from '../../dnd/onUse';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { Locale } from '../../store/locale';
import { DragSource } from '../../typings';
import { fetchNui } from '../../utils/fetchNui';
import UsefulControls from './UsefulControls';

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const [infoVisible, setInfoVisible] = useState(false);

  const [, use] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, give] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <div className="inventory-control">
        <input
          className="inventory-control-input"
          type="number"
          defaultValue={itemAmount}
          onChange={inputHandler}
          min={0}
        />
        <button className="inventory-control-button button" ref={use}>
          {Locale.ui_use || 'Use'}
        </button>
        <button className="inventory-control-button button" ref={give}>
          {Locale.ui_give || 'Give'}
        </button>
        <button className="inventory-control-button button" onClick={() => fetchNui('exit')}>
          {Locale.ui_close || 'Close'}
        </button>
      </div>

      <button className="useful-controls-button" onClick={() => setInfoVisible(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
          <path
            fill="currentColor"
            d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12"
          />
        </svg>
      </button>
    </>
  );
};

export default InventoryControl;
