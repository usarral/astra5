import { useState, useEffect } from "react";
import "./App.css";
import MapPopup from "./components/MapPopup";
import MapView from "./components/MapView";
import featureCollection from "./data/featureCollection";
import type { GeoJSONFeature } from "./types/types";
import type { Layer } from "leaflet";
import initDefaultIcon from "./utils/leafletIcon";

// initialize default Leaflet icon for markers
initDefaultIcon();

function App() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  // close modal on Escape even if overlay isn't focused
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVideoOpen(false);
        setVideoId(null);
      }
    };

    if (videoOpen) window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [videoOpen]);

  const center: [number, number] = [42.8125, -1.6458];

  const polygonStyle = {
    fillColor: "#3388ff",
    fillOpacity: 0,
    color: "#2766beff",
    weight: 6,
  };

  const onEachFeature = (feature: GeoJSONFeature, layer: Layer) => {
    console.log("Feature:", feature);
    console.log("Layer:", layer);

    // bind popup HTML (MapPopup returns an HTML string)
    if (feature.properties) {
      layer.bindPopup(MapPopup(feature.properties));
    }

    // when popup opens, attach click listener to the 'open-video' button (if present)
    layer.on("popupopen", () => {
      try {
        const popup = layer.getPopup?.();
        const el = popup?.getElement?.();
        if (!el) return;
        const btn = el.querySelector<HTMLButtonElement>(".open-video-btn");
        if (btn) {
          // ensure we don't attach multiple listeners
          btn.onclick = () => {
            const vid = btn.getAttribute("data-video") || btn.getAttribute("data-youtube") || btn.getAttribute("data-videoid");
            if (vid) {
              setVideoId(vid);
              setVideoOpen(true);
            }
          };
        }
      } catch (e) {
        // ignore
        console.error(e);
      }
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapView
        center={center}
        zoom={12}
        data={featureCollection}
        polygonStyle={polygonStyle}
        onEachFeature={onEachFeature}
      />

      {/* Modal del iframe (1080p) */}
      {videoOpen && videoId && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setVideoOpen(false);
              setVideoId(null);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: 20,
          }}
          onClick={() => {
            setVideoOpen(false);
            setVideoId(null);
          }}
        >
          <div
            role="document"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "1920px",
              height: "1080px",
              maxWidth: "95vw",
              maxHeight: "95vh",
              background: "#000",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => {
                setVideoOpen(false);
                setVideoId(null);
              }}
              aria-label="Cerrar vídeo"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10001,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>

            <iframe
              width="1920"
              height="1080"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", display: "block", border: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
