import React, { useState } from "react";

// destructure the tour object and takes reference(accepts id)
const Tour = ({ id, image, info, name, price, removeTour }) => {
  const [readmore, setReadMore] = useState(false);
  console.log(info.substring(0, 10));

  // handle read more functionallity
  const handleReadMore = () => {
    setReadMore(!readmore);
  };
  return (
    <article className="single-tour">
      <img src={image} alt={name} className="img" />
      <span className="tour-price">{price}</span>

      <div className="tour-info">
        <h5>{name}</h5>
        <p>
          {/* readmore functionality used substring method */}
          {readmore ? info : `${info.substring(0, 100)}...`}
          <button type="button" className="info-btn" onClick={handleReadMore}>
            {readmore ? "show less" : "Read more"}
          </button>
        </p>
        <button
          type="button"
          className="btn btn-block delete-btn"
          onClick={() => removeTour(id)}
        >
          Remove
        </button>
      </div>
    </article>
  );
};

export default Tour;
