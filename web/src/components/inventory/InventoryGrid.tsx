import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getTotalWeight } from '../../helpers';
import { useIntersection } from '../../hooks/useIntersection';
import { useAppSelector } from '../../store';
import { Inventory, InventoryType } from '../../typings';
import InventorySlot from './InventorySlot';
import InventoryWeight from './InventoryWeight';

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const isPlayerInventory = inventory.type === InventoryType.PLAYER;

  const PAGE_SIZE = 40;
  const HOT_SLOT_COUNT = 5;

  const pagedItems = inventory.items.slice(0, (page + 1) * PAGE_SIZE);

  const hotSlots = pagedItems.filter((item) => item.slot <= HOT_SLOT_COUNT);
  const mainSlots = isPlayerInventory ? pagedItems.filter((item) => item.slot > HOT_SLOT_COUNT) : pagedItems;

  return (
    <>
      <div
        className={`inventory-grid-wrapper ${isPlayerInventory ? 'left' : 'right'}`}
        style={{ pointerEvents: isBusy ? 'none' : 'auto' }}
      >
        <div className="inventory-grid-header-wrapper">
          <div className="inventory-grid-header-left">
            <div className="inventory-grid-header-label">
              <div className="pointer" />
              {inventory.label}
            </div>
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

        {/* isPlayerInventory && false && (
          <div className="inventory-grid-money">
            <BackgroundIcon>
              <IconMoney />
            </BackgroundIcon>
            <p className="inventory-grid-money-item inventory-grid-money-cash">
              <span className="type">cash:</span>
              <span className="value">{formattedMoneyValue(cash)}</span>
            </p>
            <p className="inventory-grid-money-item inventory-grid-money-bank">
              <span className="type">bank:</span>
              <span className="value">{formattedMoneyValue(bank)}</span>
            </p>
            <p className="inventory-grid-money-item inventory-grid-money-crypto">
              <span className="type">crypto:</span>
              <span className="value">{formattedMoneyValue(crypto)}</span>
            </p>
          </div>
        ) */}

        {isPlayerInventory && (
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
        )}
      </div>
    </>
  );
};

export default InventoryGrid;
