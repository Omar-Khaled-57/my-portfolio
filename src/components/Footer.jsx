import { useI18n } from "../i18n";

const Footer = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <center>
        <hr className="my-3 border-primary opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-secondary text-center">
          © {currentYear}{" "}
          <a href="https://github.com/Omar-Khaled-57" className="hover:underline">
            Omar Khaled™
          </a>
          . {t("footer.rights")}
        </span>
      </center>
    </footer>
  );
};

export default Footer;
