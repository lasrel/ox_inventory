import React, { useRef, useState } from 'react';
import { useExitListener } from '../../hooks/useExitListener';
import useNuiEvent from '../../hooks/useNuiEvent';
import { useAppDispatch } from '../../store';
import { closeContextMenu } from '../../store/contextMenu';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { closeTooltip } from '../../store/tooltip';
import type { Inventory as InventoryProps } from '../../typings';
import Tooltip from '../utils/Tooltip';
import Fade from '../utils/transitions/Fade';
import InventoryContext from './InventoryContext';
import InventoryHotbar from './InventoryHotbar';
import LeftInventory from './LeftInventory';
import RightInventory from './RightInventory';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  const playerCanvasRef = useRef<HTMLCanvasElement>(null);

  useNuiEvent<{ imageBase64: string }>('setupPlayerModel', (data) => {
    if (!playerCanvasRef.current) return;
    const ctx = playerCanvasRef.current.getContext('2d');
    const img = new Image();
    img.onload = () => ctx?.drawImage(img, 0, 0, 180, 300); // match your canvas size
    img.src = data.imageBase64;
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="inventory-wrapper">
          <div className="inventory-backdrop" />
          <div className="inventory-content">
            <LeftInventory />
            {/* <InventoryControl /> */}

            <div className="inventory-center">
              <canvas
                ref={playerCanvasRef}
                width={180}
                height={300}
                style={{ borderRadius: '8px', backgroundColor: '#222' }}
              />
            </div>

            <RightInventory />
          </div>
          <Tooltip />
          <InventoryContext />
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
