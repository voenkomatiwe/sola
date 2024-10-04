import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import circle from "@/assets/bg-circle.png";
import dots from "@/assets/dots.webp";
import missionIcon from "@/assets/mission.svg";
import problemIcon from "@/assets/problem.svg";
import solutionIcon from "@/assets/solution.svg";
import thinkForgeIcon from "@/assets/thinkforge-icon.svg";
import { Button } from "@/components/ui/button";

import { SubscriptionForm } from "./SubscriptionForm";

const APP_ROUTES = {
  HOME: "/",
  SOLUTION: "#solution",
  HOW_IT_WORKS: "#how-it-works",
  SUBSCRIBE: "#subscribe",
  DEFAULT: "*",
} as const;

const DEFAULT_ROUTES = [
  {
    name: "Home",
    route: APP_ROUTES.HOME,
  },
  {
    name: "Solution",
    route: APP_ROUTES.SOLUTION,
  },
  {
    name: "How It Works",
    route: APP_ROUTES.HOW_IT_WORKS,
  },
];

const landingDataArray = [
  {
    name: "Mission",
    description: "To elevate the quality of public discourse",
    icon: <img src={missionIcon} alt="missionIcon" className="w-12 h-12" />,
    shadowColor: "bg-[#FFC73C]",
  },
  {
    name: "Problem",
    description:
      "Lack of diverse, well-researched arguments in current debates, leading to one-sided or ill-informed discussions",
    icon: <img src={problemIcon} alt="problemIcon" className="w-12 h-12" />,
    shadowColor: "bg-[#E93D82]",
  },
  {
    name: "Solution",
    description:
      "AI to provide comprehensive arguments from all perspectives, enriching debates and building a diverse knowledge base.",
    icon: <img src={solutionIcon} alt="solutionIcon" className="w-12 h-12" />,
    shadowColor: "bg-[#46A857]",
  },
];

const howItWorks = [
  "Users can discover a topic to debate or start a new one.",
  "Users can read through the AI generated arguments and vote on the ones they agree with.",
  "Users can engage into a debate with the AI bot over the arguments they disagree with.",
  "Arguments and counter-arguments from conversations are used to enhance the debate knowledge",
];

export const ThinkForge = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col relative] thinkforge-bg">
      <div className="w-full flex px-6 pt-[1.875rem] pb-[0.375rem] gap-16 items-end z-30">
        <img src={thinkForgeIcon} className="w-8 h-8 shrink-0" />
        <div className='"flex-1 flex gap-6'>
          {DEFAULT_ROUTES.map(({ name, route }) => (
            <NavLink
              key={name}
              to={route}
              className={({ isActive }) =>
                `${
                  isActive ? "text-white" : "text-[#9390B4]"
                } text-base not-italic font-bold transition w-fit hover:text-white`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>
        <Button
          onClick={() => (window.location.hash = APP_ROUTES.SUBSCRIBE)}
          variant="outline"
          className="ml-auto"
        >
          Subscribe
        </Button>
      </div>
      <div className="relative flex-1">
        <div className="absolute w-full min-h-[calc(100vh+80px)] thinkforge-radial-bg -top-[80px] left-0 md:min-h-[60vh] opacity-70 md:opacity-40" />
        <img
          src={circle}
          className="min-w-[459px] absolute left-[50%] -translate-x-1/2 -top-[400px]"
        />
        <div className="relative px-3 overflow-hidden w-full flex gap-6 flex-col pb-[4.5rem] justify-end items-start xl:gap-16 xl:justify-between xl:flex-row xl:items-end min-h-[calc(100vh-48px)] xl:min-h-[calc(100vh-80px)]">
          <p className="max-w-80 text-white text-[2.5rem] not-italic font-light uppercase opacity-80 md:max-w-2xl md:text-8xl">
            Discover the truth
          </p>
          <div className="flex text-white text-xl not-italic font-normal leading-[normal] opacity-60 xl:justify-end xl:flex-1">
            <p className="xl:text-right">
              ThinkForge AI is a debate platform powered by AI
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[11.25rem] px-3 mt-[6.75rem] mb-12 md:mb-7">
          <div
            id="solution"
            className="flex flex-col gap-16 xl:gap-8 lg:flex-row lg:justify-center"
          >
            {landingDataArray.map(
              ({ name, description, icon, shadowColor }) => (
                <div key={name} className="flex flex-col max-w-[25rem] gap-3">
                  <div className="relative w-fit">
                    {icon}
                    <div
                      className={`w-4 h-4 ${shadowColor} opacity-40 blur-md absolute -bottom-2 left-[50%] -translate-x-1/2`}
                    />
                  </div>
                  <p className="text-white text-xl not-italic font-light leading-[normal] uppercase">
                    {name}
                  </p>
                  <p className="self-stretch text-white text-base not-italic font-normal leading-[140%] opacity-60 mt-1">
                    {description}
                  </p>
                </div>
              ),
            )}
          </div>
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-24">
            <p className="max-w-[720px] text-white text-xl not-italic font-normal leading-[140%] opacity-60">
              ThinkForge AI enhancing every debate with well-researched,
              balanced viewpoints. The platform offers comprehensive arguments
              for all sides of a debate, fostering informed opinions and deeper
              understanding. When talking to our AI-debate bot, you're not just
              arguing for yourself; you're contributing to a growing pool of
              knowledge and perspectives.
            </p>
            <img src={dots} />
          </div>
          <div
            id="how-it-works"
            className="flex flex-col max-w-[40.75rem] gap-8 self-center"
          >
            <p className="text-white text-center text-[2rem] lg:text-5xl not-italic font-light leading-[normal] uppercase">
              How It Works?
            </p>
            <ul className="flex flex-col gap-8">
              {howItWorks.map((name, index) => (
                <li key={name} className="flex gap-4">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-full shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-white text-base not-italic font-normal leading-[140%] opacity-60">
                    {name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div
            id="subscribe"
            className="flex w-[40.75rem] flex-col gap-8 self-center"
          >
            <p className="text-white text-center text-[2rem] lg:text-5xl not-italic font-light leading-[normal] uppercase">
              Subscribe
            </p>
            <SubscriptionForm />
          </div>
        </div>
      </div>
    </div>
  );
};
