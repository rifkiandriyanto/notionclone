import React from "react"; 
import styles from "./";
import TrashIcon from "../../images/trash.svg";

interface Position {
  x: number;
  y: number;
}

interface Actions {
  turnInto: () => void;
  deleteBlock: () => void;
}

const MENU_WIDTH = 150;
const MENU_HEIGHT = 40;

const ActionMenu: React.FC<{ position: Position; actions: Actions }> = ({
  position,
  actions,
}) => {
  const x = position.x - MENU_WIDTH / 2;
  const y = position.y - MENU_HEIGHT - 10;

  return (
    <div
      className={styles.menuWrapper}
      style={{
        top: y,
        left: x,
      }}
    >
      <div className={styles.menu}>
        <span
          id="turn-into"
          className={styles.menuItem}
          role="button"
          tabIndex={0}
          onClick={actions.turnInto}
        >
          Turn into
        </span>
        <span
          id="delete"
          className={styles.menuItem}
          role="button"
          tabIndex={0}
          onClick={actions.deleteBlock}
        >
          <img src={TrashIcon} alt="Trash Icon" />
        </span>
      </div>
    </div>
  );
};

export default ActionMenu;
