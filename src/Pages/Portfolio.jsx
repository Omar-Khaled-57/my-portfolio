import React, { useEffect, useState, useCallback, useMemo } from "react";

import { supabase } from "../supabase"; 

import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";
import useAOS, { refreshAOS } from "../hooks/useAOS";
import { useI18n } from "../i18n";
import { useTheme as useCustomTheme } from "../context/ThemeContext";


const ToggleButton = ({ onClick, isShowingMore }) => {
  const { t } = useI18n();

  return (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-secondary 
      hover:text-primary 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-secondary 
      hover:bg-secondary/80
      rounded-md
      border 
      border-primary
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? t("common.seeLess") : t("common.seeMore")}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 start-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
  );
};


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}



export default function FullWidthTabs() {
  const { t, direction } = useI18n();
  const theme = useTheme();
  const { theme: currentTheme } = useCustomTheme();
  const [value, setValue] = useState(0);

  const mainTools = useMemo(() => [
    { icon: "/tools/html.svg", language: "HTML" },
    { icon: "/tools/css.svg", language: "CSS" },
    { icon: "/tools/js.svg", language: "JavaScript" },
    { icon: "/tools/ts.svg", language: "TypeScript" },
    { icon: "/tools/react.svg", language: "React" },
    { icon: "/tools/tailwind.svg", language: "Tailwind" },
    { icon: "/tools/next.svg", language: "Next.js" },
    { icon: "/tools/postgres.svg", language: "PostgreSQL" },
    { icon: "/tools/vite.svg", language: "Vite" },
    { icon: "/tools/vue.svg", language: "Vue" },
    { icon: "/tools/nodejs.svg", language: "Node.js" },
    { icon: "/tools/express2.svg", language: "Express.js" },
    { icon: "/tools/jwt.svg", language: "JWT" },
    { icon: "/tools/supabase.svg", language: "Supabase" },
    { icon: "/tools/firebase.svg", language: "Firebase" },
    { icon: "/tools/git.svg", language: "Git" },
    { icon: "/tools/vercel.svg", language: "Vercel" },
    { icon: "/tools/SweetAlert.svg", language: "SweetAlert" },
    { icon: "/tools/sonner.svg", language: "Sonner" },
    { icon: "/tools/framer.svg", language: "Framer Motion", needsInvert: true },
    { icon: "/tools/animejs.png", language: "Anime.js" },
    { icon: "/tools/i18n.png", language: "i18next" },
    { icon: "/tools/MUI.svg", language: "Material UI" },
  ], []);

  const otherTools = useMemo(() => [
    { icon: "/tools/cpp.svg", language: "C/C++" },
    { icon: "/tools/mysql.svg", language: "MySQL" },
    { icon: "/tools/php.svg", language: "PHP" },
    { 
      icon: currentTheme === "dark" ? "/tools/rust-dark.svg" : "/tools/rust-light.svg", 
      language: "Rust" 
    },
    { icon: "/tools/tauri.svg", language: "Tauri" },
    { icon: "/tools/kotlin.svg", language: "Kotlin" },
    { icon: "/tools/python.svg", language: "Python" },
    { icon: "/tools/keras.svg", language: "Keras" },
    { icon: "/tools/tensorflow.svg", language: "TensorFlow" },
    { icon: "/tools/electron.svg", language: "Electron" },
  ], [currentTheme]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useAOS({ once: false });


  const fetchData = useCallback(async () => {
    try {
      // Fetch data from Supabase in parallel
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: false }),
        supabase.from("certificates").select("*").order('id', { ascending: false }), 
      ]);

      // Error handling for each request
      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      // Supabase returns data in the 'data' property
      const projectData = projectsResponse.data || [];
      const certificateData = certificatesResponse.data || [];

      setProjects(projectData);
      setCertificates(certificateData);

      // Store in localStorage (this functionality is maintained)
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
      
      // Notify other components that data is loaded
      window.dispatchEvent(new Event('portfolioDataLoaded'));
      refreshAOS();
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);



  useEffect(() => {
    // Try to take from localStorage first for faster load
    const cachedProjects = localStorage.getItem('projects');
    const cachedCertificates = localStorage.getItem('certificates');

    if (cachedProjects && cachedCertificates) {
        setProjects(JSON.parse(cachedProjects));
        setCertificates(JSON.parse(cachedCertificates));
    }
    
    fetchData(); // Still call fetchData to synchronize the latest data
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  // Component return statement
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-primary overflow-hidden" id="Portfolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            paddingBottom: '0.1em'
          }}>
            {t("portfolio.title")}
          </span>
        </h2>
        <p className="text-secondary max-w-2xl mx-auto text-sm md:text-base mt-2">
          {t("portfolio.description")}
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              insetInlineStart: 0,
              insetInlineEnd: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                fontFamily: "inherit",
                color: "var(--text-secondary)",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "var(--text-primary)",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "var(--text-primary)",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "var(--accent-primary)",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t("portfolio.projects")}
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t("portfolio.certificates")}
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t("portfolio.techStack")}
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-visible py-4 sm:py-8 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      img={project.img}
                      title={project.title}
                      title_ar={project.title_ar}
                      description={project.description}
                      description_ar={project.description_ar}
                      link={project.link}
                      github={project.github}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-visible py-4 sm:py-8 px-2">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={certificate.img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex flex-col justify-center items-center overflow-hidden pb-[5%]">
              <h3 className="text-xl font-bold text-primary mb-8 self-start border-l-4 border-accent-primary pl-4">
                {t("portfolio.mainTools")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5 mb-16 w-full">
                {mainTools.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon 
                      TechStackIcon={stack.icon} 
                      Language={stack.language} 
                      isWhite={stack.needsInvert && currentTheme === "dark"} 
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-primary mb-8 self-start border-l-4 border-accent-primary pl-4">
                {t("portfolio.otherTools")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5 w-full">
                {otherTools.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon 
                      TechStackIcon={stack.icon} 
                      Language={stack.language} 
                      isWhite={stack.needsInvert && currentTheme === "dark"} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
