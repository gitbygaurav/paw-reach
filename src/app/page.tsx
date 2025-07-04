import { TextAnimate } from "@/components/magicui/text-animate";
import { cn } from "@/lib/utils";
import FindNearbyButton from "@/ui/FindNearbyNgosButton";
import ListOfNgosButton from "@/ui/ListOfNgosButton";
import OurServicesText from "./_components/hero/OurServicesText";
import OurServicesCards from "./_components/hero/OurServicesCards";

export default function Home() {
  return (
    <div>
      <div
        className={cn(
          "h-screen bg-green-900",
          "bg-[url(/homepage/hero-bg.png)] bg-contain bg-center"
        )}
      >
        <div className="w-full mx-auto max-w-[1200px] min-w-[320px] relative flex flex-col items-center justify-center h-full">
          <TextAnimate
            className="md:text-7xl text-5xl text-center text-white font-bold font-[Poppins]"
            animation="blurInUp"
            by="character"
            once
          >
            Help Animals in Need
          </TextAnimate>
          <TextAnimate className="text-white text-lg text-center mt-4" once>
            A paw in need is a silent cry for help—be the hand that answers.
          </TextAnimate>
          <TextAnimate className="text-white text-lg text-center" once>
            Your small act of kindness can change their world.
          </TextAnimate>
          <FindNearbyButton />
          <ListOfNgosButton />
          <img
            className="absolute bottom-0"
            src="/homepage/dog.gif"
            alt="dog"
          />
        </div>
      </div>
      {/* service section */}
      <div className="bg-gray-100 flex flex-col items-center px-2 md:px-8 py-12">
        <OurServicesText />
        <OurServicesCards />
      </div>
    </div>
  );
}
