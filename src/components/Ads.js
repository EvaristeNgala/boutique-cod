import React, { useEffect } from "react";

export default function Ads() {
  useEffect(() => {
    // Script High Performance Format (iframe 728x90)
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

    // Adapter l'iframe après son insertion
    const interval = setInterval(() => {
      const iframe = document.querySelector("#ad-container iframe");
      if (iframe) {
        iframe.style.width = "100%"; // prend toute la largeur du conteneur
        iframe.style.height = "auto"; // hauteur automatique
        iframe.style.maxWidth = "728px"; // ne dépasse pas 728px
        clearInterval(interval);
      }
    }, 500); // vérifie toutes les 0.5s jusqu'à ce que l'iframe apparaisse

    // Nettoyage
    return () => {
      document.body.removeChild(scriptHPF);
      document.body.removeChild(scriptHPFInvoke);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      {/* Conteneur responsive pour le banner */}
      <div
        id="ad-container"
        style={{
          width: "100%",         
          maxWidth: "728px",     
          margin: "0 auto",      
          overflow: "hidden",    
        }}
      ></div>
    </div>
  );
}
