import { useTranslation } from "react-i18next";
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/Frameworks.jsx";
import CyberSecurityPanel from "../components/CyberSecurityPanel";
import TerminalPreview from "../components/TerminalPreview";

const About = () => {
  const { t } = useTranslation();
  
  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">{t("about.title")}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        <div className="flex items-end h-[30rem] md:h-full grid-default-color grid-1">
          <div className="absolute top-4 left-4 right-4 bottom-44 md:bottom-36">
            <TerminalPreview />
          </div>
          <div className="z-10">
            <p className="headtext">{t("about.name")}</p>
            <p className="subtext">
              {t("about.bio")}
            </p>
          </div>
          <div className="absolute inset-x-0 pointer-events-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
        </div>
        <div className="h-[22rem] md:h-full grid-default-color grid-2">
          <CyberSecurityPanel />
        </div>
        {/* Grid 3 */}
        <div className="grid-black-color grid-3">
          <div className="z-10 w-[65%] sm:w-[50%]">
            <p className="headtext">{t("about.timezoneTitle")}</p>
            <p className="subtext">
              {t("about.timezoneSub")}
            </p>
          </div>
          <figure className="absolute pointer-events-none -right-10 -bottom-16 sm:bottom-[-4.5rem] sm:right-[-3rem] md:left-[36%] md:top-[14%]">
            <Globe />
          </figure>
        </div>
        {/* Grid 4 */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              {t("about.collaborationTitle")}
            </p>
            <CopyEmailButton />
          </div>
        </div>
        {/* Grid 5 */}
        <div className="grid-default-color grid-5">
          <div className="z-10 w-[50%]">
            <p className="headtext">{t("about.techstackTitle")}</p>
            <p className="subtext">
              {t("about.techstackSub")}
            </p>
          </div>
          <figure className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default About;
