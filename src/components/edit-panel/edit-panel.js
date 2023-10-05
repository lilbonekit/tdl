import './edit-panel.scss';

import { CSSTransition } from 'react-transition-group';
import { useState, useEffect } from 'react';

const EditPanel = ({setListItems, editedItem, listItems, clearEditedItem, clearInputs, setClearInputs, setShowEditPanel, showEditPanel}) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputError, setInputError] = useState(false);

    useEffect(() => {
        if(editedItem) {
            setTitle(editedItem.title);
            setDescription(editedItem.description)
        }
    }, [editedItem])


    useEffect(() => {
        if(clearInputs) {
            setTitle('');
            setDescription('')
        }

        setClearInputs(false);

    }, [clearInputs])

    const onSubmit = () => {
        if (title.trim().length === 0) {
          setInputError(true);
          return;
        }
      
        setInputError(false);
      
        const newListItem = {
          title,
          description,
          done: editedItem ? editedItem.done : false, // Используем текущее значение done или false по умолчанию
        };
      
        if (editedItem) {
          // Если editedItem существует, найти его индекс в массиве
          const index = listItems.findIndex((item) => item === editedItem);
          if (index !== -1) {
            // Обновить элемент по индексу
            setListItems((prevListItems) => {
              const newListItems = [...prevListItems];
              newListItems[index] = newListItem;
              return newListItems;
            });
          }
          // Очистка editedItem, чтобы не было багов
          clearEditedItem();
        } else {
          // Если editedItem не существует, то добавить новый элемент в массив
          setListItems((prevListItems) => [...prevListItems, newListItem]);
        }
      
        setTitle('');
        setDescription('');
      }

    const onDiscard = () => {
        clearEditedItem()
        setTitle('');
        setDescription('');
    }

    return(
        <CSSTransition
            in={showEditPanel} // Указывает, должен ли компонент быть видимым
            timeout={300} // Длительность анимации
            classNames="edit-panel" // Префикс для классов анимации
            unmountOnExit>
            <div className="edit-panel">
              <h2>Task:</h2>
              <input type="text"
                    onChange={(e) => {
                          setInputError(false);
                          setTitle(e.target.value);
                      }}
                    placeholder="Type a new title"
                    value={title}
                    className={inputError ? 'error' : null}/>
              {inputError ? 
                  <p style={
                      {
                          fontSize : "12px",
                          color: "#EF4141" 
                      }
                  }>The title is required!</p> :
                  null}
              <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"/>
              <div className="edit-panel__btns">
                  <button onClick={onDiscard}>Discard</button>
                  <button className="black_btn" onClick={onSubmit}>Save</button>
              </div>
          </div>
        </CSSTransition>
    )
}

export default EditPanel