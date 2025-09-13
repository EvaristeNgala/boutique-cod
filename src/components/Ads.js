import React, { useEffect } from "react";

export default function Ads() {
  useEffect(() => {
    // Script High Performance Format (iframe 320x50)
    const scriptHPF = document.createElement("script");
    scriptHPF.type = "text/javascript";
    scriptHPF.innerHTML = `
      atOptions = {
        'key' : 'bf410b4e5b981802109c660466676291',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;
    document.body.appendChild(scriptHPF);

    const scriptHPFInvoke = document.createElement("script");
    scriptHPFInvoke.type = "text/javascript";
    scriptHPFInvoke.src =
      "//www.highperformanceformat.com/bf410b4e5b981802109c660466676291/invoke.js";
    scriptHPFInvoke.async = true;
    document.body.appendChild(scriptHPFInvoke);

    // Adapter l'iframe après son insertion pour être responsive
    const interval = setInterval(() => {
      const iframe = document.querySelector("#ad-container iframe");
      if (iframe) {
        iframe.style.width = "100%"; // prend toute la largeur du conteneur
        iframe.style.height = "auto"; 
        iframe.style.maxWidth = "320px"; // ne dépasse pas 320px
        clearInterval(interval);
      }
    }, 500);

    // Nettoyage des scripts
    return () => {
      document.body.removeChild(scriptHPF);
      document.body.removeChild(scriptHPFInvoke);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      {/* Conteneur responsive pour le banner mobile */}
      <div
        id="ad-container"
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}
