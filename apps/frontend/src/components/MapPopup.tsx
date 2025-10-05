import type { Properties } from "../types/types";

export default function MapPopup(properties: Properties) {
  return `<strong>
          ${properties.name}
        </strong>
        <br/>
        ${properties.description || ""}
        <br/>
        <i>${new Date(properties.detection_date).toLocaleDateString()}</i>
        `;
}
