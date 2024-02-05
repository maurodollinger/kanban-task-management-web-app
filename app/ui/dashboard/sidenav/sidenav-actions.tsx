import styles from './sidenav.module.scss';
import HideIcon from '@/public/assets/icon-hide-sidebar.svg';
import ColorModeSwitch from './color-mode-switch';

interface SidenavActionsProps {
    handleHideSidebar: () => void;
  }

const SidenavActions: React.FC<SidenavActionsProps> = ({ handleHideSidebar }) => {
  return (
    <div>
      <ColorModeSwitch />
      <span onClick={handleHideSidebar} className={styles.btnHideSidebar}>
        <p className='heading-m'>
          <HideIcon />
          <span>Hide Sidebar</span>
        </p>
      </span>
    </div>
  );
};

export default SidenavActions;