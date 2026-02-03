// Styles
import styles from "./SettingsModal.module.css";

// Components
import Modal from "../../../Modal/Modal";
import EditAvatar from "../EditAvatar/EditAvatar";
import EditBanner from "../EditBanner/EditBanner";
import EditData from "../EditData/EditData";
import SignOutButton from "@/components/auth/SignOutButton";

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
            className={styles.settingsModal}
        >
            <h2>User Settings</h2>
            <section>
                <p className={styles.sectionTitle}>Profile Picture</p>
                <EditAvatar avatar={avatar} onAvatarUpdate={onAvatarUpdate} />
            </section>
            <section>
                <p className={styles.sectionTitle}>Banner</p>
                <EditBanner banner={banner} onBannerUpdate={onBannerUpdate} />
            </section>
            <section>
                <p className={styles.sectionTitle}>Account</p>
                <EditData />
            </section>
            <SignOutButton />
        </Modal>
    )
}