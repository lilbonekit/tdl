import { useState, useEffect } from 'react';
import './task-panel.scss';

const TaskPanel = (props) => {

    const {editedItem, 
           listItems, 
           setListItems, 
           clearEditedItem, 
           searchString, 
           filter, 
           setShowEditPanel, 
           showEditPanel,
           setShowSearchPanel,
           showSearchPanel,
        //    setFilteredItems,
           filteredItems
        } = props;

    const [extendedItems, setExtendedItems] = useState({});
    const [editedItemIndex, setEditedItemIndex] = useState(null);

    useEffect(() => {
        const index = editedItem ? listItems.findIndex((item) => item === editedItem) : -1;
        setEditedItemIndex(index);
        // По юиксу лучше развернуть
        onExtend(index)
    }, [editedItem])

    const onCheckboxChange = (index) => {
        setListItems((prevListItems) => {
            const updatedListItems = prevListItems.map((item, i) => {
              if (i === index) {
                return { ...item, done: !item.done };
              }
              return item;
            });
            return updatedListItems;
          });
    }

    const onExtend = (index) => {
        setExtendedItems((prevExtendedItems) => {
        return {
            ...prevExtendedItems,
            [index]: !prevExtendedItems[index]
        }
    });
    };

    const messages = {
        searchStringPlusFilters : `Nothing was found for the query "${searchString}"  with the filter "${filter}"`,
        noSearchStringPlusFilter : `Nothing was found with the filter "${filter}"`
    }

    let nothingFoundMessage;

    if(listItems.length === 0 && searchString.trim()) {
        nothingFoundMessage = messages.searchStringPlusFilters;
    } 
    
    if(!searchString.trim() && filter !== 'all') {
        nothingFoundMessage = messages.noSearchStringPlusFilter
    }

    const addYourFirstItemMessage = nothingFoundMessage ? null : 'Add your first task'

    return(
        <div className='task-panel'>
            <header>
                <button onClick={() => {setShowSearchPanel(!showSearchPanel)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 18" fill="none">
                        <path style={{transition: '.3s all ease'}} d="M14.0006 7.49905C14.0006 8.93321 13.535 10.258 12.7506 11.3329L16.707 15.2917C17.0977 15.6822 17.0977 16.3165 16.707 16.7071C16.3164 17.0976 15.682 17.0976 15.2913 16.7071L11.3349 12.7483C10.2598 13.5357 8.93476 13.9981 7.50032 13.9981C3.90952 13.9981 1 11.0891 1 7.49905C1 3.90895 3.90952 1 7.50032 1C11.0911 1 14.0006 3.90895 14.0006 7.49905ZM7.50032 11.9984C8.09129 11.9984 8.67649 11.882 9.22248 11.6559C9.76847 11.4298 10.2646 11.0984 10.6825 10.6806C11.1003 10.2628 11.4318 9.76676 11.658 9.22087C11.8841 8.67499 12.0005 8.08991 12.0005 7.49905C12.0005 6.90819 11.8841 6.32311 11.658 5.77722C11.4318 5.23134 11.1003 4.73534 10.6825 4.31753C10.2646 3.89973 9.76847 3.56831 9.22248 3.3422C8.67649 3.11609 8.09129 2.99971 7.50032 2.99971C6.90934 2.99971 6.32415 3.11609 5.77816 3.3422C5.23217 3.56831 4.73607 3.89973 4.31818 4.31753C3.9003 4.73534 3.56881 5.23134 3.34266 5.77722C3.1165 6.32311 3.0001 6.90819 3.0001 7.49905C3.0001 8.08991 3.1165 8.67499 3.34266 9.22087C3.56881 9.76676 3.9003 10.2628 4.31818 10.6806C4.73607 11.0984 5.23217 11.4298 5.77816 11.6559C6.32415 11.882 6.90934 11.9984 7.50032 11.9984Z" fill={showSearchPanel ? "#8C8C8C" : "#646464" }/>
                    </svg>
                </button>
                <h1>Simple TDL</h1>
            </header>
            <main>
                <button className='task-panel__add-btn' 
                        onClick={() => setShowEditPanel(!showEditPanel)}>
                    {showEditPanel ? 'Hide edit panel' : '+ Add new task'}
                </button>
                <ul style={{ overflowY: listItems.length === 0 ? 'unset' : 'auto' }}>
                    {
                        listItems.length === 0 ? 
                        <p style={{
                            textAlign: "center",
                            width: '80%',
                            margin: '30px auto 0'
                        }}>
                            {nothingFoundMessage}
                            {addYourFirstItemMessage}
                        </p> :
                        <View listItems={listItems}
                              onCheckboxChange={onCheckboxChange}
                              onDelete={props.onDelete}
                              onEdit={props.onEdit}
                              onExtend={onExtend}
                              extendedItems={extendedItems}
                              setExtendedItems={setExtendedItems}
                              editedItemIndex={editedItemIndex}
                              editedItem={editedItem}
                              clearEditedItem={clearEditedItem}
                              filteredItems={filteredItems}/>
                    }

                </ul>
            </main>
            <footer>
                Made by lilbonekit
            </footer>
        </div>
    )
}



const View = ({listItems, onCheckboxChange, onDelete, onEdit, onExtend, extendedItems, setExtendedItems, editedItemIndex, editedItem, clearEditedItem, ref}) => {

    return listItems.map((list, index) => {

        const {title, description, done} = list;

        let classNames = '';

        if(done) {
            classNames += 'done'
        }

        if(extendedItems[index]) {
            classNames += ' extended'
        }

        if (editedItemIndex === index && editedItem) {
            classNames += ' edited';
        }

        return(
            <li
                className={`${classNames}`}
                key={index}
                onClick={(e) => {
                        const isButtonChild = e.target.closest('button') !== null;
                        if (!isButtonChild) {
                            onCheckboxChange(index);
                            if(editedItem) {
                                clearEditedItem();
                            }
                        }
                    }}>
                <div className='task-panel__name'>
                    <input type="checkbox" 
                           checked={done}/>
                    <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                </div>
                <div className='task-panel__btns'>
                    <button
                        onClick={() => {
                            onEdit(index)
                            setExtendedItems(index)
                            }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M1 3.74966C1 2.78461 1.79736 2 2.77809 2H7.2233V5.49932C7.2233 5.98321 7.62059 6.37415 8.11235 6.37415H11.6685V9.81058L9.25699 12.1836C8.97083 12.4651 8.77079 12.8151 8.67355 13.2005L8.15402 15.2482C8.09012 15.4997 8.10401 15.7622 8.19014 16H2.77809C1.79736 16 1 15.2154 1 14.2503V3.74966ZM11.6685 5.49932H8.11235V2L11.6685 5.49932ZM16.2749 8.44366L16.6749 8.83734C17.1084 9.26382 17.1084 9.95548 16.6749 10.3847L15.8581 11.1884L13.8856 9.24741L14.7024 8.44366C15.1358 8.01718 15.8387 8.01718 16.2749 8.44366ZM9.66539 13.4001L13.2549 9.86799L15.2275 11.809L11.638 15.3384C11.524 15.4505 11.3824 15.5298 11.224 15.5681L9.55426 15.9781C9.40146 16.0164 9.2431 15.9727 9.13197 15.8633C9.02084 15.754 8.97638 15.5981 9.01528 15.4478L9.43202 13.8047C9.47091 13.6516 9.55148 13.5095 9.66539 13.3974V13.4001Z" fill="#41EFA6"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            onDelete(index)
                            setExtendedItems(index)
                        }
                        }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M6.62143 2.48398L6.42857 2.875H3.85714C3.38304 2.875 3 3.26602 3 3.75C3 4.23398 3.38304 4.625 3.85714 4.625H14.1429C14.617 4.625 15 4.23398 15 3.75C15 3.26602 14.617 2.875 14.1429 2.875H11.5714L11.3786 2.48398C11.2339 2.18594 10.9366 2 10.6125 2H7.3875C7.06339 2 6.76607 2.18594 6.62143 2.48398ZM14.1429 5.5H3.85714L4.425 14.7695C4.46786 15.4613 5.03036 16 5.70804 16H12.292C12.9696 16 13.5321 15.4613 13.575 14.7695L14.1429 5.5Z" fill="#EF4141"/>
                        </svg>
                    </button>
                    <button
                        data-name="rotate"
                        onClick={() => onExtend(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M12.7437 8.84442C13.0854 9.20702 13.0854 9.79588 12.7437 10.1585L7.49473 15.728C7.153 16.0907 6.59803 16.0907 6.2563 15.728C5.91457 15.3654 5.91457 14.7766 6.2563 14.414L10.8874 9.5L6.25903 4.58602C5.9173 4.22342 5.9173 3.63455 6.25903 3.27195C6.60076 2.90935 7.15573 2.90935 7.49746 3.27195L12.7464 8.84151L12.7437 8.84442Z" fill="#646464"/>
                        </svg>
                    </button>
                </div>
            </li>
        )
    })
}

export default TaskPanel