import React from "react";
import './Timeline.css'; // Create this CSS file

function Timeline({ title, items = [] }) { // <-- IMPORTANT FIX: Default items to an empty array
  // Optional: Console logs for debugging (can remove once fixed)
  // console.log(`Timeline: ${title} received items:`, items);
  // console.log(`Timeline: Is ${title} items an array?`, Array.isArray(items));

  return (
    <div className="timeline-card section-card">
      <h4>{title}</h4>
      <div className="timeline">
        {items.length > 0 ? ( // Only map if there are items
          items.map((item, i) => (
            <div key={i} className="timeline-item">
              <h5>{item.role || item.degree} - {item.company || item.institution}</h5>
              <p>{item.duration || item.year}</p>
              {item.description && <p className="timeline-description">{item.description}</p>}
            </div>
          ))
        ) : (
          <p>No {title.toLowerCase()} details available.</p> // Message when no items
        )}
      </div>
    </div>
  );
}

export default Timeline;