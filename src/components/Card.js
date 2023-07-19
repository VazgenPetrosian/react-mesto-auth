import React from "react";
import iconLike from "../images/Like.svg";
import trashCan from "../images/trashcan.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some((item) => item._id === currentUser._id);
  // console.log(currentUser);
  const cardLikeButtonClassName = `card__like ${
    isLiked ? "card__like_active" : ""
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card);
  }
  function handleDeleteCard() {
    props.onCardDelete(props.card);
  }
  return (
    <article className="card">
      {isOwn && (
        <button
          className="card__trashcan"
          type="button"
          onClick={handleDeleteCard}
          style={{ backgroundImage: `url(${trashCan})` }}
        ></button>
      )}
      <img
        className="card__image"
        onClick={handleClick}
        src={props.card.link}
        alt={props.card.name}
      />
      <div className="card__block">
        <h2 className="card__heading">{props.card.name}</h2>
        <button
          className={cardLikeButtonClassName}
          type="button"
          onClick={handleLikeClick}
        >
          <p className="card__likes-number">{props.card.likes.length}</p>
        </button>
      </div>
    </article>
  );
}
export default Card;
