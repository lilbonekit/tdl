import './App.scss';
import { useState, useEffect } from 'react';
import TaskPanel from '../task-panel/task-panel';
import EditPanel from '../edit-panel/edit-panel';
import SearchPanel from '../search-panel/search-panel';
import Modal from '../modal/modal';

const Container = ({ children }) => {
  return (
    <div className="container">
      {children}
    </div>
  )
}

function App() {

  const initialListItems = []

  const [listItems, setListItems] = useState([...initialListItems]);
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState('all');
  const [editedItem, setEditedItem] = useState(null);
  const [clearInputs, setClearInputs] = useState(false);

  // Модалки, этот компонент переиспользуемый
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)

  // Показать скрыть панель поиска и форму
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);


  // Состояние для отфильтрованных данных
  const [filteredItems, setFilteredItems] = useState([...initialListItems]);

  useEffect(() => {
    onPerfomSearch(listItems, filters, searchString);
  }, [listItems, filters, searchString]);

  useEffect(() => {
    onSearchUpdate(searchString);
  }, [filteredItems]);

  const onSearchUpdate = (string) => {
    setSearchString(string);
  }

  const onPerfomSearch = (listItems, filters, searchString) => {
    // Создаем копию исходного массива
    const newListItems = [...listItems];
    let filteredItems = [];

    // Применяем фильтры
    switch (filters) {
      case 'all':
        // Фильтруем все элементы на основе строки поиска
        filteredItems = newListItems.filter((item) =>
          item.title.toLowerCase().includes(searchString.toLowerCase())
        );
        break;

      case 'outstanding':
        // Фильтруем элементы, у которых done === false, на основе строки поиска
        filteredItems = newListItems.filter(
          (item) =>
            !item.done &&
            item.title.toLowerCase().includes(searchString.toLowerCase())
        );
        break;

      case 'done':
        // Фильтруем элементы, у которых done === true, на основе строки поиска
        filteredItems = newListItems.filter(
          (item) =>
            item.done &&
            item.title.toLowerCase().includes(searchString.toLowerCase())
        );
        break;

      default:
        // Возвращаем исходный список, если фильтр не соответствует ни одному из условий
        filteredItems = newListItems;
        break;
    }

    // Обновляем состояние filteredItems
    setFilteredItems(filteredItems);
  };

  const onDelete = (id) => {
    setShowDeleteModal(true)
    setIdToDelete(id)
  }

  const onConfirmDelete = (id) => {
    const newListItems = [...listItems];
    newListItems.splice(id, 1);
    setListItems(newListItems);
  }

  const onEdit = (id) => {
    setEditedItem(listItems[id])
  }

  const clearEditedItem = () => {
    setEditedItem(null)
    setClearInputs(true)
  }

  const onUpdateListItems = (newListItems) => {
    setListItems(newListItems);
  };

  return (
    <>
      <Modal
        active={showDeleteModal}
        setActive={setShowDeleteModal}
        onSubmit={onConfirmDelete}
        onCancel={setIdToDelete}
        setIdToDelete={setIdToDelete}
        idToDelete={idToDelete}
        name={'Delete an item?'}
        description={'Are you sure you want to delete the item?'}
        btnSubmitName={'Delete'}
        btnCancelName={'Cancel'}/>
      <Container>
        <SearchPanel
          onSearchUpdate={onSearchUpdate}
          onFilterUpdate={setFilters}
          showSearchPanel={showSearchPanel}/>
        <TaskPanel
          setShowSearchPanel={setShowSearchPanel}
          showSearchPanel={showSearchPanel}
          setShowEditPanel={setShowEditPanel}
          showEditPanel={showEditPanel}
          clearEditedItem={clearEditedItem}
          onUpdateListItems={onUpdateListItems}
          listItems={filteredItems} // Используем отфильтрованные данные
          onDelete={onDelete}
          setListItems={setListItems}
          onEdit={onEdit}
          editedItem={editedItem}
          searchString={searchString}
          filter={filters}
          setFilteredItems={setFilteredItems}
          filteredItems={filteredItems}
          onPerfomSearch={onPerfomSearch}/>
        <EditPanel
          setShowEditPanel={setShowEditPanel}
          showEditPanel={showEditPanel}
          clearInputs={clearInputs}
          setClearInputs={setClearInputs}
          clearEditedItem={clearEditedItem}
          setFilters={setFilters}
          setSearchString={setSearchString}
          onEdit={onEdit}
          listItems={listItems}
          setListItems={setListItems}
          editedItem={editedItem}/>
    </Container>
    </>
  );
}

export default App;
