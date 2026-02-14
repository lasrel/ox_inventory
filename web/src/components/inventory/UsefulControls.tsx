import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import React, { Fragment } from 'react';
import { Locale } from '../../store/locale';

interface Props {
  infoVisible: boolean;
  setInfoVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsefulControls: React.FC<Props> = ({ infoVisible, setInfoVisible }) => {
  const { refs, context } = useFloating({
    open: infoVisible,
    onOpenChange: setInfoVisible,
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  return (
    <>
      {isMounted && (
        <FloatingPortal>
          <FloatingOverlay lockScroll className="useful-controls-dialog-overlay" data-open={infoVisible} style={styles}>
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} {...getFloatingProps()} className="useful-controls-dialog" style={styles}>
                <div className="useful-controls-dialog-title">
                  <p>{Locale.ui_usefulcontrols || 'Useful controls'} 🐂</p>
                </div>
                <div className="useful-controls-content-wrapper">
                  <Shortcut keys={['RMB']}>{Locale.ui_rmb}</Shortcut>
                  <Shortcut keys={['ALT', 'LMB']}>{Locale.ui_alt_lmb}</Shortcut>
                  <Shortcut keys={['CTRL', 'LMB']}>{Locale.ui_ctrl_lmb}</Shortcut>
                  <Shortcut keys={['SHIFT', 'Drag']}>{Locale.ui_shift_drag}</Shortcut>
                  <Shortcut keys={['CTRL', 'SHIFT', 'LMB']}>{Locale.ui_ctrl_shift_lmb}</Shortcut>
                </div>

                <button className="useful-controls-dialog-close button" onClick={() => setInfoVisible(false)}>
                  Close
                </button>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
};

export default UsefulControls;

const Shortcut = ({ keys, children }: { keys: string[]; children: string }) => (
  <div className="shortcut">
    <div className="shortcut-keys">
      {keys.map((key, index, array) => (
        <Fragment key={index}>
          <kbd>{key}</kbd>
          {index + 1 < array.length ? '+' : ''}
        </Fragment>
      ))}
    </div>
    <p>{children || 'unavailable'}</p>
  </div>
);
