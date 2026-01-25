// Styles
import styles from "./SettingsModal.module.css";

// Components
import Modal from "../../../Modal/Modal";
import EditAvatar from "../EditAvatar/EditAvatar";
import EditBanner from "../EditBanner/EditBanner";

export default function SettingsModal({
    avatar,
    banner,
    onClose,
    onAvatarUpdate,
    onBannerUpdate,
}: {
    avatar: string;
    banner: string;
    onClose: () => void;
    onAvatarUpdate?: (newAvatar: string) => void;
    onBannerUpdate?: (newBanner: string) => void;
}) {
    return (
        <Modal
            onClose={onClose}
        >
            <div className={styles.settingsModal}>
                <h2>User Settings</h2>
                <EditAvatar avatar={avatar} onAvatarUpdate={onAvatarUpdate} />
                <EditBanner banner={banner} onBannerUpdate={onBannerUpdate} />
            </div>
        </Modal>
    )
}