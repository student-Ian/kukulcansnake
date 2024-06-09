import React from 'react';
import './CustomList.css'; // Import your CSS file for styling

const CustomList = ({options, items, setItems, productInfo}) => {

    const handleOptionChange = (index, event) => {
        const newItems = [...items];
        const selectedOption = event.target.value;

        // Check if the selected option is already chosen by any other item
        const optionAlreadyChosen = newItems.some((item, i) => i !== index && item.option === selectedOption);

        // If the option is not already chosen, update the state
        if (!optionAlreadyChosen) {
            newItems[index].option = selectedOption;
            setItems(newItems);
        }
    };

    const handleInputChange = (index, event) => {
        const newItems = [...items];
        const value = event.target.value;
        let quantity = value === '' ? '' : parseInt(value);
        // quantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
        newItems[index].value = quantity;
        setItems(newItems);
    };

    const preventInvalidValue = (index, event) => {
        const newItems = [...items];
        const value = event.target.value;
        if (value === '' || parseInt(value) < 1) {
            newItems[index].value = 1;
            setItems(newItems);
        }
    };

    const addItem = () => {
        // Check if any option is selected before adding a new item
        const lastItem = items[items.length - 1];
        if (lastItem.option !== '') {
            setItems([...items, {option: '', value: 1}]);
        }
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    return (
        <div className="custom-list-container">
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="input-container">
                            <select
                                title="flavors"
                                value={item.option}
                                onChange={(event) => handleOptionChange(index, event)}
                                className="option-select"
                            >
                                <option value="">請選擇口味（*表示含酒精）</option>
                                {options.map((opt, idx) => (
                                    <option key={idx} value={opt}>
                                        {idx !== -1 && productInfo.products.find(product => product.name === opt).alcoholic ? "*" : ""}{opt} ─── ( ${idx !== -1 && productInfo.products.find(product => product.name === opt).price} )
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={item.value}
                                onChange={(event) => handleInputChange(index, event)}
                                onBlur={(event) => preventInvalidValue(index, event)}
                                className="numeric-input"
                            />
                        </div>
                        {items.length !== 1 && <div className="remove-button" onClick={() => removeItem(index)}></div>}
                    </li>
                ))}
                {<div className="add-button" onClick={addItem}></div>}
            </ul>
        </div>
    );
};

export default CustomList;
