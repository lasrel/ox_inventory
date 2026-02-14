import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { onGive } from '../../dnd/onGive';
import { onUse } from '../../dnd/onUse';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { Locale } from '../../store/locale';
import { DragSource } from '../../typings';
import { fetchNui } from '../../utils/fetchNui';
import BackgroundIcon from '../BackgroundIcon';
import IconGive from '../utils/icons/IconGive';
import IconInfo from '../utils/icons/IconInfo';
import IconUse from '../utils/icons/IconUse';
import IconX from '../utils/icons/IconX';
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
        <button className="inventory-control-button big" ref={use}>
          <BackgroundIcon color="white">
            <IconUse />
          </BackgroundIcon>
          {Locale.ui_use || 'Use'}
        </button>
        <button className="inventory-control-button big" ref={give}>
          <BackgroundIcon color="white">
            <IconGive />
          </BackgroundIcon>
          {Locale.ui_give || 'Give'}
        </button>
        <button className="inventory-control-button" onClick={() => fetchNui('exit')}>
          <BackgroundIcon color="white">
            <IconX />
          </BackgroundIcon>
          {Locale.ui_close || 'Close'}
        </button>
      </div>

      <button className="useful-controls-button" onClick={() => setInfoVisible(true)}>
        <IconInfo />
      </button>
    </>
  );
};

export default InventoryControl;
