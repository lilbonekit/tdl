import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './modal.scss';

const Modal = (props) => {
  const {
    name,
    description,
    onCancel,
    onSubmit,
    idToDelete,
    setIdToDelete,
    btnCancelName,
    btnSubmitName,
    active,
    setActive,
  } = props;

  return (
    <CSSTransition
      in={active}
      timeout={300}
      classNames="modal"
      unmountOnExit
    >
      <div className="modal" onClick={() => setActive(false)}>
        <div className="modal__content" onClick={(event) => event.stopPropagation()}>
          <h2>{name}</h2>
          <p>{description}</p>
          <div className="modal__btns">
            <button onClick={() => {
              onCancel(null);
              setActive(false);
            }}>{btnCancelName}</button>
            <button
              className="black_btn"
              onClick={() => {
                onSubmit(idToDelete);
                setIdToDelete(null);
                setActive(false);
              }}>{btnSubmitName}
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
