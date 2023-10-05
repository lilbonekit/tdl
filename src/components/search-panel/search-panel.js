import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './search-panel.scss';

const SearchPanel = (props) => {
    const [string, setString] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all'); // Исходное значение выбранного фильтра

    const { onSearchUpdate, onFilterUpdate, showSearchPanel } = props;

    const onFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const submitData = () => {
        onFilterUpdate(selectedFilter);
        if(string.trim().length === 0) {
            onSearchUpdate('')
        } else {
            onSearchUpdate(string.toLowerCase());  
        }
        // setString('')
    };

    return (
        <CSSTransition
            in={showSearchPanel}
            timeout={300}
            classNames="search-panel" // Замените на ваш класс анимации
            unmountOnExit>
            <div className="search-panel">
                <h2>Search</h2>
                <input
                    type="text"
                    placeholder="Search..."
                    value={string}
                    onChange={(event) => {
                            setString(event.target.value)
                        }
                    }
                />
                <div className="search-panel__radio-buttons">
                    <div>
                        <label>
                            <input
                                type="radio"
                                value={'all'}
                                checked={selectedFilter === 'all'}
                                onChange={(e) => onFilterChange(e)}
                            />
                            All
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="done"
                                checked={selectedFilter === 'done'}
                                onChange={(e) => onFilterChange(e)}
                            />
                            Done
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="outstanding"
                                checked={selectedFilter === 'outstanding'}
                                onChange={(e) => onFilterChange(e)}
                            />
                            Outstanding
                        </label>
                    </div>
                </div>
                <button className="black_btn" onClick={submitData}>
                    Search
                </button>
            </div>
        </CSSTransition>
    );
};

export default SearchPanel;
