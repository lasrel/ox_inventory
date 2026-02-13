import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTotalWeight } from '../../helpers';
import { useIntersection } from '../../hooks/useIntersection';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { Inventory, InventoryType } from '../../typings';
import InventoryControl from './InventoryControl';
import InventorySlot from './InventorySlot';
import InventoryWeight from './InventoryWeight';

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  const left = useSelector(selectLeftInventory);
  const player = left.player;
  const accounts = player?.accounts ?? player?.money ?? {};
  const cash = accounts.money ?? accounts.cash ?? 0;
  const bank = accounts.bank ?? 0;
  const crypto = accounts.crypto ?? 0;

  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const PAGE_SIZE = 40;
  const HOT_SLOT_COUNT = 5;

  const pagedItems = inventory.items.slice(0, (page + 1) * PAGE_SIZE);

  const hotSlots = pagedItems.filter((item) => item.slot <= HOT_SLOT_COUNT);
  const mainSlots =
    inventory.type === InventoryType.PLAYER ? pagedItems.filter((item) => item.slot > HOT_SLOT_COUNT) : pagedItems;

  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div className="inventory-grid-header-wrapper">
          <div className="inventory-grid-header-left">
            <p className="inventory-grid-header-label">{inventory.label}</p>
            {inventory.type === 'player' && (
              <div className="inventory-grid-money">
                <p className="inventory-grid-money-item inventory-grid-money-cash">
                  <span className="type">cash:</span>
                  <span className="value">{cash}</span>
                </p>
                <p className="inventory-grid-money-item inventory-grid-money-bank">
                  <span className="type">bank:</span>
                  <span className="value">{bank}</span>
                </p>
                <p className="inventory-grid-money-item inventory-grid-money-crypto">
                  <span className="type">crypto:</span>
                  <span className="value">{crypto}</span>
                </p>
              </div>
            )}
          </div>
          {inventory.maxWeight && <InventoryWeight weight={weight} maxWeight={inventory.maxWeight} />}
        </div>

        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {mainSlots.map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>

        {inventory.type === InventoryType.PLAYER ? (
          <div className="inventory-hot-slots">
            {hotSlots.map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
                isHotSlot
              />
            ))}
          </div>
        ) : (
          <InventoryControl />
        )}
      </div>
    </>
  );
};

export default InventoryGrid;
