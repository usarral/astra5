import type { Properties } from "../types/types";

export default function MapPopup(properties: Properties) {
  return `<strong>
          ${properties.name}
        </strong>
        <br/>
        ${properties.description || ""}
        <br/>
        ${properties.detection_date ? `Detection Date: ${new Date(properties.detection_date).toLocaleDateString()}` : ""}
        `;
}
