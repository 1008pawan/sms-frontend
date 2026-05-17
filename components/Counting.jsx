import React, { useEffect, useState } from "react";

const countersData = [
  { id: 1, label: "Alumni Worldwide", value: 6000, suffix: "k+" },
  { id: 2, label: "Expert Doctors", value: 16, suffix: "+" },
  { id: 3, label: "Success Rate", value: 99, suffix: "%" },
  { id: 4, label: "Research Labs", value: 11, suffix: "+" },
];

const Counting = () => {
  const [counts, setCounts] = useState(countersData.map(() => 0));

  useEffect(() => {
    const duration = 3000;
    const frameRate = 30;
    const totalFrames = Math.round((duration / 1000) * frameRate);

    const increments = countersData.map(
      (counter) => counter.value / totalFrames,
    );
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      setCounts((prev) =>
        prev.map((count, i) => {
          const nextCount = count + increments[i];
          return nextCount >= countersData[i].value
            ? countersData[i].value
            : nextCount;
        }),
      );

      if (frame >= totalFrames) clearInterval(counterInterval);
    }, duration / totalFrames);

    return () => clearInterval(counterInterval);
  }, []);

  return (
    <div className="opacity-0 scale-90 animate-[zoomOutFade_2s_ease_forwards]">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="bg-[#05162e] text-white rounded-3xl p-14 -mt-12 relative z-10 shadow-lg"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 text-center gap-6">
            {countersData.map((counter, i) => (
              <div
                key={counter.id}
                className={
                  i !== countersData.length - 1
                    ? "md:border-r border-white/25"
                    : ""
                }
              >
                <h2 className="text-4xl font-bold"> 
                  {counter.label === "Success Rate"
                    ? "98-99%"
                    : counter.id === 1
                      ? `${Math.floor(counts[i] / 1000)}${counter.suffix}`
                      : `${Math.floor(counts[i])}${counter.suffix}`}
                </h2>
                <p className="text-white/50 mb-0">{counter.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counting;
