import { useTranslation } from "react-i18next";
import { mySocials } from "../constants";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <section className="flex flex-wrap items-center justify-between gap-5 pb-3 text-sm text-neutral-400 c-space">
      <div className="mb-4 bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />
      <div className="flex gap-2">
        <p>{t("footer.terms")}</p>
        <p>|</p>
        <p>{t("footer.privacy")}</p>
      </div>
      <div className="flex gap-3">
        {mySocials.map((social, index) => (
          <a href={social.href} key={index}>
            <img src={social.icon} className="w-5 h-5" alt={social.name} />
          </a>
        ))}
      </div>
      <p>{t("footer.rights")}</p>
    </section>
  );
};

export default Footer;
