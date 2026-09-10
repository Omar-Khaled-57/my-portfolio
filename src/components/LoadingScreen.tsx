import Loader from "./Loader";
import { useI18n } from "../i18n";

const LoadingScreen = () => {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="loader-stack">
        <Loader />
        <span className="loader-caption">{t("common.loading")}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
