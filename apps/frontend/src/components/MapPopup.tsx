import type { Properties } from "../types/types";

export default function MapPopup(properties: Properties) {
  const videoId =
    (properties as any).video ||
    (properties as any).youtube ||
    (properties as any).youtubeId ||
    (properties as any).videoId ||
    null;

  const videoButton = videoId
    ? `
      <br/>
      <button class="open-video-btn" data-video="${String(videoId)}" style="margin-top:6px;padding:6px 8px;background:#ff3333;color:#fff;border:none;border-radius:6px;cursor:pointer;">Ver vídeo</button>
    `
    : "";

  return `<strong>
          ${properties.name}
        </strong>
        <br/>
        ${properties.description || ""}
        <br/>
        ${properties.detection_date ? `Detection Date: ${new Date(properties.detection_date).toLocaleDateString()}` : ""}
        ${videoButton}
        `;
}
