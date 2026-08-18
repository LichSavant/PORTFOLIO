export default function PortraitField() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[61%] md:block">
      <div className="absolute left-[12%] top-[10%] font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">
        [ SUBJECT_RENDER_001 ]
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="ascii-person font-mono text-[5px] leading-[0.72] text-white/70">
          {ASCII_PERSON}
        </div>
      </div>

      <div className="absolute bottom-[9%] left-[9%] right-[5%] h-32 opacity-30">
        <Waveform />
      </div>
    </div>
  );
}

const ASCII_PERSON = String.raw`
                   .....:::::.....
                ...:::::::::::::::...
              ..::::::########::::::..
            ..:::::#############:::::..
           .:::::################:::::.
          .::::###################::::.
          ::::#####################::::
          :::#########%%%%#########::::
          :::######%%%%%%%%%#######::::
          :::#####%%%%%%%%%%%######::::
           ::#####%%%%%%%%%%%#####::::
            :######%%%%%%%%%######:::
             #######%%%%%%%#######
                ######%%%#####
                 ##########
               ##############
            ####################
         ##########################
      ################################
    ####################################
   ######################################
   ######################################
    ####################################
     ##################################
       ##############################
`;

function Waveform() {
  return (
    <svg
      viewBox="0 0 1000 200"
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <path
        d="
        M0 160
        C80 150 100 170 170 145
        C220 125 250 180 310 120
        C350 80 390 150 430 90
        C470 20 520 160 570 100
        C620 45 640 130 690 90
        C730 65 790 140 840 125
        C900 110 930 150 1000 135
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-white"
      />
    </svg>
  );
}
