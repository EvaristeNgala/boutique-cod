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

    // -------------------
    // Script Native Banner
    // -------------------
    const scriptNative = document.createElement("script");
    scriptNative.async = true;
    scriptNative.setAttribute("data-cfasync", "false");
    scriptNative.src = "//pl27637623.revenuecpmgate.com/eaae9e09975c1ead0dd9e771377b57db/invoke.js";
    document.body.appendChild(scriptNative);

    // Nettoyage des scripts si on quitte la page
    return () => {
      document.body.removeChild(scriptHPF);
      document.body.removeChild(scriptHPFInvoke);
      document.body.removeChild(scriptNative);
    };
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      {/* Zone où les pubs s’affichent */}
      <div id="ad-container"></div>
      <div id="container-eaae9e09975c1ead0dd9e771377b57db"></div>
    </div>
  );
}
