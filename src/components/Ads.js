import React, { useEffect } from "react";

export default function Ads() {
  useEffect(() => {
    // -------------------
    // Script High Performance Format (iframe 728x90)
    // -------------------
    const scriptHPF = document.createElement("script");
    scriptHPF.type = "text/javascript";
    scriptHPF.innerHTML = `
      atOptions = {
        'key' : '6cc78755053df02ff901acbb1dbf131a',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    document.body.appendChild(scriptHPF);

    const scriptHPFInvoke = document.createElement("script");
    scriptHPFInvoke.type = "text/javascript";
    scriptHPFInvoke.src = "//www.highperformanceformat.com/6cc78755053df02ff901acbb1dbf131a/invoke.js";
    scriptHPFInvoke.async = true;
    document.body.appendChild(scriptHPFInvoke);

    // Nettoyage des scripts si on quitte la page
    return () => {
      document.body.removeChild(scriptHPF);
      document.body.removeChild(scriptHPFInvoke);
    };
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      {/* Zone où le banner classique s’affiche */}
      <div id="ad-container"></div>
    </div>
  );
}
